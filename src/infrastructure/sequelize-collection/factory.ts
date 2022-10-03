import { SqliteCollection } from "./index";
import { Contract, Job, Profile } from "./model";

export class SequelizeCollectionFactory {
  static make(collection: "contract" | "job" | "profile"): SqliteCollection<any> {
    switch (collection) {
      case "contract":
        return new SqliteCollection<any>(Contract);
      case "job":
        return new SqliteCollection<any>(Job);
      case "profile":
        return new SqliteCollection<any>(Profile);
    }
  }
}
