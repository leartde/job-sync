import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../../types/authentication/User.ts";
import Logout from "../../services/authentication/Logout.ts";
import GetTokens from "../../services/authentication/GetTokens.ts";
type JwtUserClaims = {
  id: string;
  email: string;
  role: "JobSeeker" | "Employer" | "Admin";
};

type RawJwtClaims = {
  id: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string | string[];
}

function mapJwtClaims(raw: RawJwtClaims): JwtUserClaims {
  return {
    id: raw.id,
    email: raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
    role: Array.isArray(raw["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
      ? (raw["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"][0] as "JobSeeker" | "Employer" | "Admin")
      : (raw["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as "JobSeeker" | "Employer" | "Admin"),
  };
}


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
                  const decoded = jwtDecode<RawJwtClaims>(tokens.accessToken);
                  const userClaims = mapJwtClaims(decoded);
                  const currentUser: User = {
                    id: userClaims.id,
                    email: userClaims.email,
                    role: userClaims.role,
                  };
                  setUser(currentUser);
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
    const login = async (tokens: {accessToken: string, refreshToken: string}, isPersistent: boolean) => {
        try {
            const decodedToken = jwtDecode<RawJwtClaims>(tokens.accessToken)
          const userClaims = mapJwtClaims(decodedToken);
            const user: User = {
                id: userClaims.id,
                email: userClaims.email,
                role: userClaims.role,
            };

            setUser(user);

            if (isPersistent) {
                localStorage.setItem("isPersistent", "true");
            } else {
                localStorage.removeItem("isPersistent");
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

