import { Collection } from "../collection";
import { Contract, JobModel, Profile } from "../entitities";

export class BestClientsReportUseCase {
  constructor(private jobModel: JobModel, private contractCollection: Collection<Contract>, private profileCollection: Collection<Profile>) {}

  async execute(start: Date, end: Date, limit: number): Promise<any[]> {
    const jobs = await this.jobModel.getJobsPaidBetween(start, end);

    const contractIds = jobs.reduce((acc, job) => {
      if (!acc.includes(job.ContractId)) {
        acc.push(job.ContractId);
      }
      return acc;
    }, [] as string[]);

    const contracts = await this.contractCollection.find({
      where: {
        id: contractIds,
      },
    });

    const profileIds = contracts.reduce((acc, contract) => {
      if (!acc.includes(contract.ClientId)) {
        acc.push(contract.ClientId);
      }
      return acc;
    }, [] as string[]);

    const profiles = await this.profileCollection.find({
      where: {
        id: profileIds,
      },
    });

    const clients = profiles.map((profile) => {
      const contractsFromClient = contracts.filter((contract) => contract.ClientId === profile.id);
      const jobsFromClient = jobs.filter((job) => contractsFromClient.map((contract) => contract.id).includes(job.ContractId));
      const total = jobsFromClient.reduce((acc, job) => acc + job.price, 0);

      return {
        id: profile.id,
        fullName: profile.firstName + " " + profile.lastName,
        paid: total,
      };
    });

    return clients.sort((a, b) => b.paid - a.paid).slice(0, limit);
  }
}
