'use client';
import { auth } from '@/lib/config/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useState, createContext, useContext, useEffect } from 'react';

type Status = 'loading' | 'authenticated' | 'unauthenticated';
export type UserSession = {
  user: User | null;
  status: Status;
};

const UserContext = createContext<UserSession>({
  user: null,
  status: 'loading',
});

type Props = {
  children: React.ReactNode;
};
export default function SessionProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    return onAuthStateChanged(auth, async (userInfo) => {
      if (userInfo) {
        const token = await userInfo.getIdTokenResult();
        const role = token.claims.role as 'admin' | 'user';
        setUser({ ...userInfo, role: role });
      }
      setStatus(userInfo ? 'authenticated' : 'unauthenticated');
    });
  }, []);

  return (
    <UserContext.Provider value={{ user: user, status: status }}>
      {children}
    </UserContext.Provider>
  );
}

export function useSession() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a UserContext');
  }
  return context;
}
