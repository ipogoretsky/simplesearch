import {UserModel} from "./UserModel";
import {RepoModel} from "./RepoModel";
import {OrgModel} from "./OrgModel";

export class DataModel {
  public users:UserModel[] = [];
  public repos:{string:RepoModel[]}[] = [];
  public orgs:{string:OrgModel[]}[] = []
}