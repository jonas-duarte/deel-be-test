import { Model, Op } from "sequelize";
import { Collection, CollectionData } from "../../domain/collection";

export class SqliteCollection<T extends CollectionData> implements Collection<T> {
  constructor(private Model: new (...args: any[]) => Model) {}

  add(item: T): Promise<void> {
    throw new Error("Method not implemented.");
  }

  remove(item: T): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async get(id: string): Promise<T> {
    // @ts-ignore
    const data = await this.Model.findOne({
      where: { id },
    });
    return data.get({ plain: true });
  }

  find(filter: { where: any }): Promise<T[]> {
    // @ts-ignore
    const data = this.Model.findAll(filter);
    return data;
  }

  async update(item: T): Promise<void> {
    // @ts-ignore
    const data = await this.Model.findOne({
      where: { id: item.id },
    });

    if (!data) throw new Error("Item not found");

    await data.update(item);
  }
}

// TODO: this is a workaround and shouldn't be imported from here
export const Operations = Op;
