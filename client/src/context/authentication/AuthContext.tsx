import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../../types/authentication/User.ts";
import Logout from "../../services/authentication/Logout.ts";
import GetTokens from "../../services/authentication/GetTokens.ts";
type UserClaims = {
    id: string;
    email: string;
    role: "jobseeker" | "employer" | "admin";
};


type AuthContextType = {
    user: User | null;
    login: (tokens: { accessToken: string; refreshToken: string }, rememberMe: boolean) => Promise<User>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const tokens = await GetTokens();
                if (tokens.accessToken) {
                    const decoded = jwtDecode(tokens.accessToken) as UserClaims;
                    const user: User = {
                        id: decoded.id,
                        email: decoded.email,
                        role: decoded.role,
                    };
                    setUser(user);
                }
            } catch (error) {
                console.error("Auth init error:", error);
            } finally {
                setAuthLoading(false);
            }
        };
        initializeAuth().then();
    }, []);
    if (authLoading) {
        return <div>Loading...</div>;
    }
    const login = async (tokens: {accessToken: string, refreshToken: string}, rememberMe: boolean) => {
        try {
            const decodedToken = jwtDecode(tokens.accessToken) as UserClaims;
            const user: User = {
                id: decodedToken.id,
                email: decodedToken.email,
                role: decodedToken.role,
            };

            setUser(user);

            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
            } else {
                localStorage.removeItem("rememberMe");
            }
            return user;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = async () => {
        await Logout();
        setUser(null);
        localStorage.removeItem("rememberMe");
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

