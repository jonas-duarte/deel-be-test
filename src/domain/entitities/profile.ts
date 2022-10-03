import { Collection } from "../collection";

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  profession: string;
  balance: number;
  type: "client" | "contractor";
};

export class ProfileModel {
  constructor(private profileCollection: Collection<Profile>) {}

  async getById(id: string): Promise<Profile | null> {
    return await this.profileCollection.get(id);
  }

  async transferBalance(client: Profile, contractor: Profile, amount: number): Promise<void> {
    if (client.balance < amount) throw new Error("Client does not have enough balance");

    await this.profileCollection.update({ ...client, balance: client.balance - amount });
    await this.profileCollection.update({ ...contractor, balance: contractor.balance + amount });
  }

  async depositBalance(client: Profile, amount: number): Promise<void> {
    await this.profileCollection.update({ ...client, balance: client.balance + amount });
  }
}
