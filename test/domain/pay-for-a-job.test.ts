import { PayForAJobUseCase } from "./../../src/domain/use-cases/pay-for-a-job";
import { Contract, ContractModel, Job, JobModel, Profile, ProfileModel } from "../../src/domain/entitities";
import { MockCollection } from "../common/mock-collection";

const profileMockData: Profile[] = [
  {
    id: "1",
    type: "client",
    balance: 1000,
    firstName: "John",
    lastName: "Doe",
    profession: "Developer",
  },
  {
    id: "2",
    type: "contractor",
    balance: 1000,
    firstName: "Foo",
    lastName: "Bar",
    profession: "Architect",
  },
];

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

describe("Pay for a job use case", () => {
  it("should pay for a open job and update balances", async () => {
    const profileModel = new ProfileModel(new MockCollection(profileMockData));
    const contractModel = new ContractModel(new MockCollection(contractMockData));
    const jobModel = new JobModel(new MockCollection(jobMockData), contractModel);
    const payForAJobUseCase = new PayForAJobUseCase(contractModel, profileModel, jobModel);

    const clientBefore = await profileModel.getById("1");
    await payForAJobUseCase.execute(clientBefore as Profile, "1");

    const client = await profileModel.getById("1");
    const contractor = await profileModel.getById("2");
    const job = await jobModel.getById("1");

    expect(client?.balance).toEqual(900);
    expect(contractor?.balance).toEqual(1100);
    expect(job?.paid).toEqual(true);
  });

  it("should throw an error if job is already paid", async () => {
    const profileModel = new ProfileModel(new MockCollection(profileMockData));
    const contractModel = new ContractModel(new MockCollection(contractMockData));
    const jobModel = new JobModel(new MockCollection(jobMockData), contractModel);
    const payForAJobUseCase = new PayForAJobUseCase(contractModel, profileModel, jobModel);

    const clientBefore = await profileModel.getById("1");

    await expect(payForAJobUseCase.execute(clientBefore as Profile, "3")).rejects.toThrowError("Job already paid");

    const client = await profileModel.getById("1");
    const contractor = await profileModel.getById("2");
    const job = await jobModel.getById("3");

    expect(client?.balance).toEqual(1000);
    expect(contractor?.balance).toEqual(1000);
    expect(job?.paid).toEqual(true);
  });
});
