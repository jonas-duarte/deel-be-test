import { BestProfessionsReportUseCase } from './domain/use-cases/best-profession-report';
import { BestClientsReportUseCase } from "./domain/use-cases/best-clients-report";
import { BalanceDepositUseCase } from "./domain/use-cases/balance-deposit";
import { PayForAJobUseCase } from "./domain/use-cases/pay-for-a-job";
import express from "express";
import bodyParser from "body-parser";
import { SequelizeCollectionFactory } from "./infrastructure/sequelize-collection/factory";
import { ContractModel, JobModel, ProfileModel } from "./domain/entitities";

const contractCollection = SequelizeCollectionFactory.make("contract");
const jobCollection = SequelizeCollectionFactory.make("job");
const profileCollection = SequelizeCollectionFactory.make("profile");

const contractModel = new ContractModel(contractCollection);
const profileModel = new ProfileModel(profileCollection);
const jobModel = new JobModel(jobCollection, contractModel);

const payForAJobUseCase = new PayForAJobUseCase(contractModel, profileModel, jobModel);
const balanceDepositUseCase = new BalanceDepositUseCase(profileModel, jobModel);
const bestProfessionsReportUseCase = new BestProfessionsReportUseCase(jobModel, contractCollection, profileCollection);
const bestClientsReportUseCase = new BestClientsReportUseCase(jobModel, contractCollection, profileCollection);

const app = express();
app.use(bodyParser.json());

const getProfile = async (req: any, res: any, next: any) => {
  const profile = await profileModel.getById(req.get("profile_id"));
  if (!profile) return res.status(401).end();
  req.profile = profile;
  next();
};

app.get("/contracts/:id", getProfile, async (req: any, res: any) => {
  const { id } = req.params;
  const contract = await contractModel.getFromProfileById(req.profile, id);
  if (!contract) return res.status(404).end();
  res.json(contract);
});

app.get("/contracts", getProfile, async (req: any, res: any) => {
  const contracts = await contractModel.getActiveFromProfile(req.profile);
  res.json(contracts);
});

app.get("/jobs/unpaid", getProfile, async (req: any, res: any) => {
  const jobs = await jobModel.getUnpaidFromProfile(req.profile);
  res.json(jobs);
});

app.post("/jobs/:jobId/pay", getProfile, async (req: any, res: any) => {
  const { jobId } = req.params;
  await payForAJobUseCase.execute(req.profile, jobId);
  res.status(200).end();
});

app.post("/balances/deposit/:userId", getProfile, async (req: any, res: any) => {
  // await balanceDepositUseCase.execute(req.profile, req.params.userId, req.body.amount);
  res.status(200).end();
});

app.get("/admin/best-profession", getProfile, async (req: any, res: any) => {
  const { start, end } = req.query;
  const report = await bestProfessionsReportUseCase.execute(new Date(start), new Date(end));
  res.json(report);
});

app.get("/admin/best-clients", getProfile, async (req: any, res: any) => {
  const { start, end, limit } = req.query;
  const report = await bestClientsReportUseCase.execute(new Date(start), new Date(end), parseInt(limit ?? "2"));
  res.json(report);
});

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
