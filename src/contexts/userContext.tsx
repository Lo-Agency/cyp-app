import { createContext, useContext, useState } from "react";
interface User {
  id?: number;
  name: string;
  email?: string;
   password?:string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");};

  return (
    <UserContext.Provider value={{ user, setUser ,logout}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};