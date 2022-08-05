import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'


export default class UsersController {
  public async index ({ response }: HttpContextContract) {
    let users = await User.query().where('role_id',"!=", 2);
	if (users.length > 0) {
      response.status(200)
      return {
        data: users
      }
    } else {
      response.status(404)
      return {
        message: 'data not found'
      }
    }
  }

  public async show ({ params, response }: HttpContextContract) {
    const db_user = await User.find(params.id)
    if (db_user) {
      response.status(200)
      return {
        data: db_user
      }
    } else {
      response.status(404)
      return {
        message: 'user not found'
      }
    }
  }

}
