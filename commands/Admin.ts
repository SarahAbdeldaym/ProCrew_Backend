import { BaseCommand } from '@adonisjs/core/build/standalone'



export default class Admin extends BaseCommand {


  /**
   * Command name is used to run the command
   */
  public static commandName = 'admin'
  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Create a new Admin'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }


  public async run () {
    const { default: User } = await import('App/Models/User')

    const name = await this.prompt.ask('Enter Name : ')
    const email = await this.prompt.ask('Enter email : ')
    const password = await this.prompt.secure('Choose account password : ')
    const userType = await this.prompt.choice('Select account type', [
      {
        name: 'admin',
        message: 'Admin (Complete access)',
      },
    ])

    const verifyEmail = await this.prompt.confirm('Send account verification email?')


    await User.create({
      name,
      email,
      password,
      role_id:2,
    })
    console.log({
      name, email, password, userType, verifyEmail
    })
  }
}
