import { ContractModel, JobModel, Profile, ProfileModel } from "../entitities";

export class PayForAJobUseCase {
  constructor(private contractModel: ContractModel, private profileModel: ProfileModel, private jobModel: JobModel) {}

  async execute(profile: Profile, jobId: string): Promise<void> {
    if (profile.type !== "client") throw new Error("Only clients can pay jobs");

    const job = await this.jobModel.getById(jobId);
    if (!job) throw new Error("Job not found");

    if(job.paid) throw new Error("Job already paid");

    const contract = await this.contractModel.getFromProfileById(profile, job.ContractId);
    if (!contract) throw new Error("Contract not found");

    const clientProfile = profile;
    const contractorProfile = await this.profileModel.getById(contract.ContractorId);

    if (!contractorProfile) throw new Error("Contractor not found");

    await this.profileModel.transferBalance(clientProfile, contractorProfile, job.price);
    await this.jobModel.setToPaid(job);
  }
}
