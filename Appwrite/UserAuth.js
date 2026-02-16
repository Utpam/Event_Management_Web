import { Client, Account, ID } from "appwrite";
import { config } from '../src/config/config'

class AuthService {
    client = new Client()
    account

    constructor() {
        this.client
            .setProject(config.projectId)
            .setEndpoint(config.appwriteEndpoint)
        this.account = new Account(this.client)
    }

    // Create Account or SignUp
    createAccount = async (email, password) => {
        try{
            return await this.account.create(
                {
                    userId: ID.unique(),
                    email: email,
                    password: password
                }
            )
        }
        catch (error) {
            console.error('Error: ', error)
        }
    }

    // Login
    authlogin = async (email, password) => {
        try{
            return await this.account.createEmailPasswordSession(
                {
                    email: email,
                    password: password
                }
            )
        }
        catch (error) {
            console.error('Error: ', error)
        }
    }

    // Logout
    authlogout = async () => {
        try{
            return await this.account.deleteSessions('current')
        }
        catch (error) {
            console.error('Error: ', error)
        }
    }

    // Create Recovery - email an recovery page endpoint
    recoverPassword = async (email) => {
        try {
            return await this.account.createRecovery(
                {
                    email: email,
                    url: 'http://localhost:5173/update-password'
                }
            )
        } catch (error) {
            console.error('Error:', error)
        }
    }

    updatePassword = async (userId, secret, password) => {
        try {
            return await this.account.updateRecovery(
                {
                    userId: userId,
                    secret: secret,
                    password: password
                }
            )
        } catch (error) {
            console.error("Error: ", error)
        }
    }

    getCurrentUser = async () => {
        try {
            return await this.account.get();
        } catch (error) {
            console.error('Error: ', error)
        }
    }
}

export const authService = new AuthService()