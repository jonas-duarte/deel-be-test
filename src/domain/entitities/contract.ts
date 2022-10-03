import { Collection } from "../collection";
import { Profile } from "./profile";

export type Contract = {
  id: string;
  terms: string;
  status: "new" | "in_progress" | "terminated";
  ClientId: string;
  ContractorId: string;
};

export class ContractModel {
  constructor(private contractCollection: Collection<Contract>) {}

  async getFromProfileById(profile: Profile, id: string): Promise<Contract | null> {
    const contract = await this.contractCollection.get(id);
    if (!contract) return null;
    if (contract.ClientId !== profile.id && contract.ContractorId !== profile.id) return null;
    return contract;
  }

  async getActiveFromProfile(profile: Profile): Promise<Contract[]> {
    const contracts = await this.contractCollection.find({
      where: {
        [profile.type === "client" ? "ClientId" : "ContractorId"]: profile.id,
        status: ["new", "in_progress"],
      },
    });

    return contracts;
  }
}
