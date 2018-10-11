import {UserModel} from "./User";
import {RepoModel} from "./RepoModel";

export class SearchResultModel {
  id: string;
  node_id: string;
  login: string;
  avatar_url: string;
  repos_url: string;
  type: string;
  url: string;
  html_url: string;
  organizations_url:string;

  user: UserModel;
  repos: RepoModel[] = [];
}