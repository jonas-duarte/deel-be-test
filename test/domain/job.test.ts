import { Contract, ContractModel, Job, JobModel } from "../../src/domain/entitities";
import { MockCollection } from "../common/mock-collection";

const contractMockData: Contract[] = [
  {
    id: "1",
    ClientId: "1",
    ContractorId: "2",
    status: "new",
    terms: "I will do this job",
  },
  {
    id: "2",
    ClientId: "1",
    ContractorId: "4",
    status: "terminated",
    terms: "I will do this job",
  },
];
const contractModel = new ContractModel(new MockCollection(contractMockData));

const jobMockData: Job[] = [
  {
    id: "1",
    description: "I will do this job",
    price: 100,
    ContractId: "1",
    paid: false,
    paymentDate: null,
  },
  {
    id: "2",
    description: "I will do this job",
    price: 100,
    ContractId: "2",
    paid: false,
    paymentDate: null,
  },
  {
    id: "3",
    description: "I will do this job",
    price: 100,
    ContractId: "1",
    paid: true,
    paymentDate: new Date(),
  },
];
const jobModel = new JobModel(new MockCollection(jobMockData), contractModel);

describe("Job Model", () => {
  it("should get unpaid jobs from client profile", async () => {
    const jobs = await jobModel.getUnpaidFromProfile({ id: "1", type: "client" } as any);
    expect(jobs).toEqual([jobMockData[0]]);
  });

  it("should get unpaid jobs from contractor profile", async () => {
    const jobs = await jobModel.getUnpaidFromProfile({ id: "2", type: "contractor" } as any);
    expect(jobs).toEqual([jobMockData[0]]);
  });
});
