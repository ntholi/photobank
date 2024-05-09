import { Resource } from '@/app/(admin)/admin-core/repository/repository';

export type Role = 'user' | 'employee' | 'admin';

export interface User extends Resource {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumbers: string[];
  image: string | null;
  roles: Role[];
  storeIds: string[];
  //Courier id is the same as user id
  isCourier: boolean;
}
