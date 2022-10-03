import { Contract, ContractModel } from "../../src/domain/entitities";
import { MockCollection } from "../common/mock-collection";

const mockData: Contract[] = [
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
    status: "in_progress",
    terms: "I will do this job",
  },
  {
    id: "3",
    ClientId: "1",
    ContractorId: "2",
    status: "terminated",
    terms: "I will do this job",
  },
  {
    id: "4",
    ClientId: "3",
    ContractorId: "2",
    status: "terminated",
    terms: "I will do this job",
  },
  {
    id: "5",
    ClientId: "5",
    ContractorId: "6",
    status: "terminated",
    terms: "I will do this job",
  },
];

const contractModel = new ContractModel(new MockCollection(mockData));

describe("Contract Model", () => {
  it("should return contract from client", async () => {
    const contracts = await contractModel.getFromProfileById({ id: "1" } as any, "1");
    expect(contracts).toEqual(mockData[0]);
  });

  it("should return contract from contractor", async () => {
    const contracts = await contractModel.getFromProfileById({ id: "2" } as any, "1");
    expect(contracts).toEqual(mockData[0]);
  });

  it("shouldn't return contract from other", async () => {
    const contracts = await contractModel.getFromProfileById({ id: "3" } as any, "1");
    expect(contracts).toEqual(null);
  });

  it("should return active contracts from client", async () => {
    const contracts = await contractModel.getActiveFromProfile({ id: "1", type: "client" } as any);
    expect(contracts).toEqual([mockData[0], mockData[1]]);
  });

  it("should return active contracts from contractor", async () => {
    const contracts = await contractModel.getActiveFromProfile({ id: "2", type: "contractor" } as any);
    expect(contracts).toEqual([mockData[0]]);
  });

  it("should return an empty array if no active contracts", async () => {
    const contracts = await contractModel.getActiveFromProfile({ id: "5", type: "client" } as any);
    expect(contracts).toEqual([]);
  });
});
