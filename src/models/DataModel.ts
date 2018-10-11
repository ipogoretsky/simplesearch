import {UserModel} from "./UserModel";
import {RepoModel} from "./RepoModel";
import {OrgModel} from "./OrgModel";

export class DataModel {
  public users: UserModel[] = [];
  public repos: { string: RepoModel[] }[] = [];
  public orgs: { string: OrgModel[] }[] = []

  get singleUser (): UserModel | undefined {
    return this.users.length ? this.users[0] : undefined;
  }

  get singleUserRepos (): RepoModel[] {
    return this.singleUser ? this.repos[this.singleUser.id] : [];
  }

  get singleUserOrgs (): OrgModel[] {
    return this.singleUser ? this.orgs[this.singleUser.id] : [];

  }
}