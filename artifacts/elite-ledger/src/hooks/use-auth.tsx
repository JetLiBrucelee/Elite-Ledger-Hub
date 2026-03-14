import { createContext, useContext, ReactNode } from "react";
import { useGetMe, getGetMeQueryKey, type User } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPendingApproval: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isPendingApproval: false,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
      refetchOnWindowFocus: true,
      refetchInterval: 15000,
    }
  });

  const isAuthenticated = !!user;
  const isPendingApproval = user?.status === "pending";
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ 
      user: user || null, 
      isLoading, 
      isAuthenticated, 
      isPendingApproval,
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
