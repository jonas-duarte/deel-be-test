import { JobModel, Profile, ProfileModel } from "../entitities";

export class BalanceDepositUseCase {
  constructor(private profileModel: ProfileModel, private jobModel: JobModel) {}

  async execute(profile: Profile, amount: number) {
    if(profile.type !== "client") throw new Error("Only clients can deposit money");
    const jobs = await this.jobModel.getUnpaidFromProfile(profile);
    // The max amount to deposit should be lower than the 25% amount of unpaid jobs
    const maxAmount = jobs.reduce((acc, job) => acc + job.price, 0) * 0.25;
    if (amount > maxAmount) throw new Error("Amount to deposit is too high");
    await this.profileModel.depositBalance(profile, amount);
  }
}
