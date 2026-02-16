import { createContext, useContext, useState, useEffect } from "react";
import { authService } from '../Appwrite/UserAuth';

const UserAuthContext = createContext();

export const useAuth = () => {
    return useContext(UserAuthContext);
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [authStatus, setAuthStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    setAuthStatus(true);
                    setUser(userData);
                    console.log("Session restored from Appwrite");
                }
            } catch (error) {
                console.log("No active session");
                setAuthStatus(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = (user) => {
        setAuthStatus(true);
        setUser(user);
        console.log("logged in")
    }
    const logout = () => {
        setAuthStatus(false);
        setUser(null);
        console.log("logged out")
    }
    
    const value = {
        user,
        authStatus,
        login,
        logout,
        isLoading
    }

    return <UserAuthContext.Provider value={value}>
        {children}
    </UserAuthContext.Provider>
}
