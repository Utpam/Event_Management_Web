import { createContext, useContext, useState, useEffect } from "react";
import { authService } from '../Appwrite/UserAuth';
import dbService from '../Appwrite/db';

const UserAuthContext = createContext();

export const useAuth = () => {
    return useContext(UserAuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authStatus, setAuthStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    // Sync with Users Collection
                    let profile = await dbService.getUserProfile(userData.$id);
                    if (!profile) {
                        // Create profile if missing (e.g. first login after migration)
                        profile = await dbService.createUserProfile(userData.$id, userData.name, userData.email);
                    }

                    const memberships = await dbService.getUserMemberships(userData.$id);
                    setAuthStatus(true);
                    setUser({ ...userData, ...profile, memberships: memberships.documents }); // Merge Auth & DB data
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

    const login = async (user) => {
        // Fetch profile
        let profile = await dbService.getUserProfile(user.$id);
        if (!profile) {
            profile = await dbService.createUserProfile(user.$id, user.name, user.email);
        }

        const memberships = await dbService.getUserMemberships(user.$id);
        setAuthStatus(true);
        setUser({ ...user, ...profile, memberships: memberships.documents });
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
