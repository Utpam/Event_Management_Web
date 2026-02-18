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
    createAccount = async (email, password, name) => {
        try {
            return await this.account.create(
                {
                    userId: ID.unique(),
                    email: email,
                    password: password,
                    name: name
                }
            )
        }
        catch (error) {
            console.error('Error: ', error)
            throw error
        }
    }

    // Login
    authlogin = async (email, password) => {
        try {
            return await this.account.createEmailPasswordSession(
                {
                    email: email,
                    password: password
                }
            )
        }
        catch (error) {
            console.error('Error: ', error)
            throw error
        }
    }

    // Logout
    authlogout = async () => {
        try {
            return await this.account.deleteSessions('current')
        }
        catch (error) {
            console.error('Error: ', error)
            throw error
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
            throw error
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
            throw error
        }
    }

    getCurrentUser = async () => {
        try {
            return await this.account.get();
        } catch (error) {
            console.error('Error: ', error)
            // getCurrentUser is often called on load, so throwing might cause unhandled promise rejections if not caught.
            // However, consistent behavior is better. Use with caution in App.jsx.
            // For now, I'll log and return null to avoid breaking initial load if user is not logged in.
            // Actually, standard practice is to throw or return null.
            // The original code returned undefined (implicit).
            // Let's return null explicitly if we don't throw, but the implementation plan said throw.
            // But `App.jsx` might just call it to check session.
            // Let's check App.jsx usage before deciding on getCurrentUser.
            throw error
        }
    }
}

export const authService = new AuthService()