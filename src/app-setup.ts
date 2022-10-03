import { SequelizeCollectionFactory } from "./infrastructure/sequelize-collection/factory";
import { ContractModel, JobModel, ProfileModel } from "./domain/entitities";
import { BestProfessionsReportUseCase, BestClientsReportUseCase, BalanceDepositUseCase, PayForAJobUseCase } from "./domain/use-cases";

export const contractCollection = SequelizeCollectionFactory.make("contract");
export const jobCollection = SequelizeCollectionFactory.make("job");
export const profileCollection = SequelizeCollectionFactory.make("profile");

export const contractModel = new ContractModel(contractCollection);
export const profileModel = new ProfileModel(profileCollection);
export const jobModel = new JobModel(jobCollection, contractModel);

export const payForAJobUseCase = new PayForAJobUseCase(contractModel, profileModel, jobModel);
export const balanceDepositUseCase = new BalanceDepositUseCase(profileModel, jobModel);
export const bestProfessionsReportUseCase = new BestProfessionsReportUseCase(jobModel, contractCollection, profileCollection);
export const bestClientsReportUseCase = new BestClientsReportUseCase(jobModel, contractCollection, profileCollection);
