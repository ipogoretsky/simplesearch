import {UserModel} from "./User";
import {JsonProperty} from "../utils/MapUtils";

export class RepoModel {
  id:string;
  name: string;
  html_url: string;

  @JsonProperty<UserModel>({clazz: UserModel})
  owner:UserModel;
}