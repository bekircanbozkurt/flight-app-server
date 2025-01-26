export interface DatabaseService {
  readCollection<T>(collectionName: string): Promise<T[]>;
  findOne<T>(
    collectionName: string,
    predicate: (item: T) => boolean,
  ): Promise<T | null>;
  findMany<T>(
    collectionName: string,
    predicate: (item: T) => boolean,
  ): Promise<T[]>;
  create<T>(collectionName: string, newItem: T): Promise<T>;
  update<T>(
    collectionName: string,
    predicate: (item: T) => boolean,
    updateData: Partial<T>,
  ): Promise<T | null>;
  delete<T>(
    collectionName: string,
    predicate: (item: T) => boolean,
  ): Promise<boolean>;
}
