import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../../types/authentication/User.ts";
import Logout from "../../services/authentication/Logout.ts";
import GetTokens from "../../services/authentication/GetTokens.ts";
import { setAccessToken } from "../../utils/api.ts";
import RefreshToken from "../../services/authentication/RefreshToken.ts";
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
        let accessToken: string | null = null;

        try {
          const res = await GetTokens();
          if (res.status === 200 && res.data?.accessToken) {
            accessToken = res.data.accessToken;
            setAccessToken(accessToken);
          }
        } catch (getTokenError) {
          console.warn("GetTokens failed, trying refresh...", getTokenError);
          try {
            const refreshRes = await RefreshToken(
              localStorage.getItem("isPersistent") === "true"
            );
            if (refreshRes.status === 200 && refreshRes.data?.accessToken) {
              accessToken = refreshRes.data.accessToken;
              setAccessToken(accessToken);
            }
          } catch (refreshError) {
            console.error("RefreshToken failed:", refreshError);
          }
        }
        if (!accessToken) {
          console.warn("No access token available — user likely logged out.");
          return;
        }
        const decoded = jwtDecode<RawJwtClaims>(accessToken);
        const userClaims = mapJwtClaims(decoded);
        const currentUser: User = {
          id: userClaims.id,
          email: userClaims.email,
          role: userClaims.role,
        };
        setUser(currentUser);
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
      setAccessToken(tokens.accessToken);
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
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("rememberMe");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}
