import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";


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

}
