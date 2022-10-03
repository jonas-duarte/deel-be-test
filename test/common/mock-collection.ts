import { Collection, CollectionData } from "./../../src/domain/collection";

export class MockCollection<T extends CollectionData> implements Collection<T> {
  private data: T[];
  constructor(data: T[]) {
    this.data = JSON.parse(JSON.stringify(data));
  }

  add(item: T): Promise<void> {
    throw new Error("Method not implemented.");
  }
  remove(item: T): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async get(id: string): Promise<T | null> {
    return this.data.find((item) => item.id === id) || null;
  }
  async find(filter: { where: any }): Promise<T[]> {
    const result = this.data.filter((item) => {
      return Object.keys(filter.where).every((key) => {
        const value = filter.where[key];
        if (Array.isArray(value)) {
          // @ts-ignore
          return value.includes(item[key]);
        }
        // @ts-ignore
        return item[key] == value;
      });
    });
    return result;
  }
  async update(item: T): Promise<void> {
    const _item = this.data.find((i) => i.id === item.id);
    if (!_item) throw new Error("Item not found");
    Object.assign(_item, item);
  }
}
