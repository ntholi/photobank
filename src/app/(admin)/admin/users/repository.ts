import { db } from '@/lib/config/firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FirebaseRepository } from '../../admin-core/repository/firebase-repository';
import { Role, User } from './model/user';

class UserRepository extends FirebaseRepository<User> {
  constructor() {
    super('users');
  }

  async createFirebaseUser(obj: {
    uid: string;
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    phoneNumber?: string | null;
  }) {
    const { firstName, lastName } = this.getNames(obj.displayName);
    //TODO: THIS SHOULD BE A CLOUD FUNCTION
    const user = {
      firstName,
      lastName,
      email: obj.email || null,
      image: obj.photoURL || null,
      roles: ['user'],
      storeIds: [],
      phoneNumbers: obj.phoneNumber ? [obj.phoneNumber] : [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = doc(db, 'users', obj.uid);
    if (!(await getDoc(docRef)).exists()) {
      await setDoc(docRef, user);
    }
  }

  async updateRoles(id: string, roles: Role[]) {
    await setDoc(
      doc(db, this.collectionName, id),
      {
        roles,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  getNames(displayName: string | null | undefined) {
    if (!displayName) {
      return { firstName: '', lastName: '' };
    }
    const names = displayName.split(' ');
    if (names.length === 1) return { firstName: names[0], lastName: '' };
    return {
      firstName: names.slice(0, -1).join(' '),
      lastName: names.at(-1) || '',
    };
  }
}

export const userRepository = new UserRepository();
