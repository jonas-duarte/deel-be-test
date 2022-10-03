import { Collection } from "../collection";
import { ContractModel } from "./contract";
import { Profile, ProfileModel } from "./profile";

// TODO: this is a workaround and domain shouldn't depend on infrastructure
import { Operations } from "../../infrastructure/sequelize-collection";

export type Job = {
  id: string;
  description: string;
  price: number;
  paid: boolean;
  paymentDate: Date | null;
  ContractId: string;
};

export class JobModel {
  constructor(private jobCollection: Collection<Job>, private contractModel: ContractModel) {}

  async getUnpaidFromProfile(profile: Profile): Promise<Job[]> {
    const contracts = await this.contractModel.getActiveFromProfile(profile);

    const jobs = await this.jobCollection.find({
      where: {
        paid: false,
        ContractId: contracts.map((contract) => contract.id),
      },
    });

    return jobs;
  }

  async getById(id: string): Promise<Job | null> {
    return await this.jobCollection.get(id);
  }

  async setToPaid(job: Job): Promise<void> {
    job.paid = true;
    job.paymentDate = new Date();

    await this.jobCollection.update(job);
  }

  async getJobsPaidBetween(start: Date, end: Date): Promise<Job[]> {
    const jobs: Job[] = await this.jobCollection.find({
      where: {
        paid: true,
        paymentDate: {
          [Operations.between]: [start.toISOString(), end.toISOString()],
        },
      },
    });

    return jobs;
  }
}
