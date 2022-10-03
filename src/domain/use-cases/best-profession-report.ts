import { Collection } from "../collection";
import { Contract, JobModel, Profile, ProfileModel } from "../entitities";

export class BestProfessionsReportUseCase {
  constructor(private jobModel: JobModel, private contractCollection: Collection<Contract>, private profileCollection: Collection<Profile>) {}

  async execute(start: Date, end: Date): Promise<any> {
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
      if (!acc.includes(contract.ContractorId)) {
        acc.push(contract.ContractorId);
      }
      return acc;
    }, [] as string[]);

    const profiles = await this.profileCollection.find({
      where: {
        id: profileIds,
      },
    });

    const professions = profiles.reduce((acc, profile) => {
      if (!acc.includes(profile.profession)) {
        acc.push(profile.profession);
      }
      return acc;
    }, [] as string[]);

    const earnedByProfession = professions.map((profession) => {
      const contractorsFromProfession = profiles.filter((contractor) => contractor.profession === profession);
      const contractsFromProfession = contracts.filter((contract) =>
        contractorsFromProfession.map((contractor) => contractor.id).includes(contract.ContractorId)
      );
      const jobsFromProfession = jobs.filter((job) => contractsFromProfession.map((contract) => contract.id).includes(job.ContractId));
      const total = jobsFromProfession.reduce((acc, job) => acc + job.price, 0);

      return {
        profession: profession,
        paid: total,
      };
    });

    return earnedByProfession.sort((a, b) => b.paid - a.paid);
  }
}
