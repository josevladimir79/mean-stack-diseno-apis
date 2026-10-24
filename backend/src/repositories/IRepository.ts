export interface IRepository<T> {
  findAll(): Promise<T[]>;
  getBy<K extends keyof T>(field: K, value: T[K]): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
}
