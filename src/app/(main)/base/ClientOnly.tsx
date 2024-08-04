'use client';
import { useState, useEffect, ReactNode } from 'react';

type ClientOnlyProps = {
  children: ReactNode;
};

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
};

export default ClientOnly;
