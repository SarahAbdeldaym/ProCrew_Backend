import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import Role from "App/Models/Role";
import Mail from "@ioc:Adonis/Addons/Mail";
import Route from "@ioc:Adonis/Core/Route";
import Hash from "@ioc:Adonis/Core/Hash";


export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const newUserData = schema.create({
      name: schema.string({}, [rules.trim()]),
      email: schema.string({}, [
        rules.email(),
        rules.unique({ table: "users", column: "email" }),
      ]),
      password: schema.string({}, [rules.confirmed()]),
    });
    const validatedNewUserData = await request.validate({
      schema: newUserData,
    });
    const newUser = await User.create(validatedNewUserData);

    response.status(200);
    return response.created({message : "user created successfully"});
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");
    try {
      const token = await auth
        .use("api")
        .attempt(email, password, { expiresIn: "7days" });
      await User.query()
        .where("email", email)
        .update({ remember_me_token: token.toJSON().token });

      const user = await User.query().where("email", email);

      const role = await Role.query().where("id", user[0].role_id);

      return {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: role[0].name,
        token: token.toJSON().token,
      };
    } catch {
      return response.unauthorized("Invalid credentials");
    }
  }


  public async logout({ auth }: HttpContextContract) {
    await auth.logout();
    return { message: "logged out successfully" };
  }


  public async checkAndSendMail({ request }: HttpContextContract) {
    const email = request.input("email");
    const isUserExist = await User.query().where("email", email);
    if (isUserExist.length > 0) {
      const customUrl =
        "http://localhost:4200" +
        Route.makeSignedUrl("confirm-password-change");

      await Mail.use("smtp").send((message) => {
        message
          .from("admin@admin.com")
          .to("sarahabdeldaym@gmail.com")
          .subject("Verify your password")
          .htmlView("emails/resetPassword", {
            data: isUserExist[0],
            url: customUrl,
          });
      });
      return {
        message: "mail sent",
        status: true,
      };
    } else {
      return { message: "email doesn't exist" };
    }
  }

  public async confirmPassword({ request }: HttpContextContract) {
    const email = request.input("email");
    const newPassword: string = request.input("password");
    const HashedNewPassword = await Hash.make(newPassword);

    const user = await User.findBy("email", email);
    if (!user) {
      return { message: "Email is not Correct" };
    } else {
      await User.query()
        .where("email", email)
        .update({ password: HashedNewPassword });
      return { message: "password has been modified" };
    }
  }


  public async redirect({ ally }: HttpContextContract) {
    return ally.use("github").redirect();
  }

  public async handleCallback({ ally, auth, response }: HttpContextContract) {
    const githubUser = ally.use("github");

    /**
     * User has explicitly denied the login request
     */
    if (githubUser.accessDenied()) {
      return "Access was denied";
    }

    /**
     * Unable to verify the CSRF state
     */
    if (githubUser.stateMisMatch()) {
      return "Request expired. try again";
    }

    /**
     * There was an unknown error during the redirect
     */
    if (githubUser.hasError()) {
      return githubUser.getError();
    }

    /**
     * Finally, access the user
     */
    const user = await githubUser.user();

    const findUser = {
      email: user.email as string,
    };

    const userDetails = {
      name: user.name as string,
      email: user.email as string,
      avatar_url: user.avatarUrl as string,
      provider_id: user.id as string,
      provider: "github",
    };

    const newUser = await User.firstOrCreate(findUser, userDetails);

    await auth.use("api").login(newUser);
    response.status(200);

    return newUser;
  }
}
