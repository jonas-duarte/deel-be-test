import express from "express";
import bodyParser from "body-parser";

import {
  profileModel,
  contractModel,
  jobModel,
  payForAJobUseCase,
  balanceDepositUseCase,
  bestProfessionsReportUseCase,
  bestClientsReportUseCase,
} from "./app-setup";

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
