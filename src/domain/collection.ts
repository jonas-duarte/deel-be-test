type Query = {
  limit?: number;
  where?: any;
};

export type CollectionData = {
  id: string;
};

export interface Collection<T extends CollectionData> {
  add(item: T): Promise<void>;
  remove(item: T): Promise<void>;
  get(id: string): Promise<T | null>;
  find(query: Query): Promise<T[]>;
  update(item: T): Promise<void>;
}
