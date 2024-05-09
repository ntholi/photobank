export interface Resource {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ResourceCreate<OmitType> = Omit<OmitType, 'id' | 'updatedAt'>;

export interface Repository<T extends Resource> {
  listen: (
    callback: (resources: T[]) => void,
    filter?: { field: string; value: any }
  ) => () => void;
  getAll: (limit?: number) => Promise<T[]>;
  get: (id: string) => Promise<T | undefined>;
  create: (resource: ResourceCreate<T>) => Promise<T>;
  update: (id: string, resource: T) => Promise<T>;
  delete: (id: string) => Promise<void>;
  getAllBy: (field: string, value: string) => Promise<T[]>;
  getResource<R extends Resource>(resourceName: string, id: string): Promise<R>;
  getResourceList<R extends Resource>(resourceName: string): Promise<R[]>;
}
