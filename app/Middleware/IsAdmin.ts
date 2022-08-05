import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class IsAdmin {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    if (auth.user?.role_id !== 2) {
      response.unauthorized({ error: "Must be Admin" });
      return;
    }
    await next();
  }
}
