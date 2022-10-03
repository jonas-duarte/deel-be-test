import { Contract, ContractModel, Job, JobModel, Profile, ProfileModel } from "../../src/domain/entitities";
import { MockCollection } from "../common/mock-collection";
import { BalanceDepositUseCase } from "./../../src/domain/use-cases/balance-deposit";

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
    price: 500,
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
    price: 500,
    ContractId: "1",
    paid: false,
    paymentDate: null,
  },
];

describe("Balance deposit", () => {
  it("should deposit money to client's balance", async () => {
    const profileModel = new ProfileModel(new MockCollection(profileMockData));
    const contractModel = new ContractModel(new MockCollection(contractMockData));
    const jobModel = new JobModel(new MockCollection(jobMockData), contractModel);
    const balanceDepositUseCase = new BalanceDepositUseCase(profileModel, jobModel);

    await balanceDepositUseCase.execute(profileMockData[0], 250);

    const profile = await profileModel.getById("1");

    expect(profile?.balance).toBe(1250);
  });

  it("shouldn't deposit money to client's balance", async () => {
    const profileModel = new ProfileModel(new MockCollection(profileMockData));
    const contractModel = new ContractModel(new MockCollection(contractMockData));
    const jobModel = new JobModel(new MockCollection(jobMockData), contractModel);
    const balanceDepositUseCase = new BalanceDepositUseCase(profileModel, jobModel);

    await expect(balanceDepositUseCase.execute(profileMockData[0], 251)).rejects.toThrowError("Amount to deposit is too high");

    const profile = await profileModel.getById("1");

    expect(profile?.balance).toBe(1000);
  });

  // TODO: shouldn't deposit money to contractor's balance
});
