import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import Role from "App/Models/Role";

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


}
