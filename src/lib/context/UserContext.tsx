import { User, onAuthStateChanged } from 'firebase/auth';
import { useState, createContext, useContext, useEffect } from 'react';
import { auth } from '../config/firebase';

export type UserSession = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

const defaultSate = {
  user: null,
  loading: true,
  error: null,
};

function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        setUser(userInfo);
      }
      setLoading(false);
    });
  }, []);

  return (
    <UserContext.Provider
      value={{ user: user, loading: loading, error: error }}
    >
      {children}
    </UserContext.Provider>
  );
}

const UserContext = createContext<UserSession>(defaultSate);
export const useSession = () => useContext(UserContext);
export default UserContextProvider;
