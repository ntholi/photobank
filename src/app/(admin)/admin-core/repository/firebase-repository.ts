import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  limit as limitQuery,
  Query,
  Firestore,
} from 'firebase/firestore';
import { Repository, Resource, ResourceCreate } from './repository';

export class FirebaseRepository<T extends Resource> implements Repository<T> {
  constructor(
    readonly db: Firestore,

    protected readonly collectionName: string,
  ) {}

  listen(
    callback: (resources: T[]) => void,
    filter?: { field: string; value: any },
  ): () => void {
    const ref = collection(this.db, this.collectionName);
    const q = filter
      ? query(ref, where(filter.field, '==', filter.value))
      : ref;
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resources: T[] = [];
      snapshot.forEach((doc) => {
        resources.push({ ...doc.data(), id: doc.id } as T);
      });
      callback(resources);
    });
    return unsubscribe;
  }

  listenForDocument(id: string, callback: (resource: T) => void): () => void {
    const docRef = doc(this.db, this.collectionName, id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T);
      }
    });
    return unsubscribe;
  }

  async getAll(
    limit = 10,
    filter?: { field: string; value: any },
  ): Promise<T[]> {
    const ref = collection(this.db, this.collectionName);
    const q = filter
      ? query(ref, where(filter.field, '==', filter.value), limitQuery(limit))
      : query(ref, limitQuery(limit));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as T);
  }

  async get(id: string): Promise<T | undefined> {
    const docRef = doc(this.db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return undefined;
  }

  async create(resource: ResourceCreate<T>): Promise<T> {
    const docRef = await addDoc(collection(this.db, this.collectionName), {
      ...resource,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...resource } as T;
  }

  async update(id: string, resource: Omit<T, 'id'>): Promise<T> {
    const docRef = doc(this.db, this.collectionName, id);
    await setDoc(docRef, {
      ...resource,
      updatedAt: serverTimestamp(),
    });
    return { ...resource, id: docRef.id } as T;
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.db, this.collectionName, id));
  }

  async getAllBy(field: string, value: string, limit = 8): Promise<T[]> {
    const q = query(
      collection(this.db, this.collectionName),
      where(field, '==', value),
      orderBy('createdAt', 'desc'),
      limitQuery(limit),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
  }

  async search(field: string, value: string): Promise<T[]> {
    const q = query(
      collection(this.db, this.collectionName),
      where(field, '>=', value),
      where(field, '<=', value + '\uf8ff'),
    );
    const querySnapshot = await getDocs(q);
    const categories: T[] = [];
    querySnapshot.forEach((doc) => {
      categories.push({ ...doc.data(), id: doc.id } as T);
    });
    return categories;
  }

  docRef(id: string) {
    return doc(this.db, this.collectionName, id);
  }

  async getDocs(query: Query): Promise<T[]> {
    const snapshot = await getDocs(query);
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
  }

  async getDoc(query: Query): Promise<T | undefined> {
    const snapshot = await getDocs(query);
    if (snapshot.empty) return undefined;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as T;
  }

  async getResource<R extends Resource>(
    resourceName: string,
    id: string,
  ): Promise<R> {
    const docRef = doc(this.db, resourceName, id);
    const docSnap = await getDoc(docRef);
    return { id: docSnap.id, ...docSnap.data() } as R;
  }

  async getResourceList<R extends Resource>(
    resourceName: string,
  ): Promise<R[]> {
    const q = query(
      collection(this.db, resourceName),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as R);
  }
}
