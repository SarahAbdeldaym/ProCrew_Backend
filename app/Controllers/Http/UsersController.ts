import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema } from '@ioc:Adonis/Core/Validator'


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


  public async update ({ params, request, response }: HttpContextContract) {
    const newUserSchema = schema.create({
      name: schema.string({ trim: true }),
      email: schema.string({ trim: true })
    })
    const payload = await request.validate({ schema: newUserSchema })
    const user = await User.find(params.id)
    if (user) {
      response.status(200)
      user.name = payload.name || user.name
      user.email = payload.email || user.email

      const createdUser = await user.save()
      return {
        message: 'User updated successfully',
        data: createdUser
      }
    } else {
      response.status(404)
      return {
        message: 'User not found'
      }
    }
  }
  public async destroy ({ params, response }: HttpContextContract) {
    const user = await User.find(params.id)

    if (user?.role_id == 2) {
      return {
        message: 'admin cannot be deleted'
      }
    } else {
      if (user) {
        response.status(200)
        await user.delete()
        return {
          success: 'User deleted successfully'
        }
      } else {
        response.status(404)
        return {
          failed: 'User not found'
        }
      }
    }
  }
}
