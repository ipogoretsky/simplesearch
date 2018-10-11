import {SearchResultModel} from "../models/SearchResultModel";
import MapUtils from "../utils/MapUtils";
import {RepoModel} from "../models/RepoModel";
import {UserModel} from "../models/UserModel";
import * as request from "superagent";
import {DataModel} from "../models/DataModel";
import {OrgModel} from "../models/OrgModel";
import {SuperAgentRequest} from "superagent";

class UserApi {

  public search (searchText: string | undefined): Promise<DataModel> {
    searchText = searchText || '';

    return new Promise<DataModel>((resolve, reject) => {
      this.get(`https://api.github.com/search/users?q=${searchText}+repos:%3E42+followers:%3E1000`)
        .then((res) => {
          let data: DataModel = new DataModel();
          let results: SearchResultModel[] = MapUtils.deserializeCollection(SearchResultModel, res.body.items);

          Promise.all([
            /* users */
            ...results.map((sr: SearchResultModel) =>
              this.get(sr.url)
                .then((res) => {
                  let user: UserModel = MapUtils.deserialize(UserModel, res.body);

                  data.users.push(user);
                }).catch((e) => {
                console.error(e);
              })),

            /* repos */
            ...results.map((sr: SearchResultModel) =>
              this.get(sr.repos_url)
                .then((res) => {
                  let repos: RepoModel[] = MapUtils.deserializeCollection(RepoModel, res.body.slice(0, 3));

                  repos.sort((a: RepoModel, b: RepoModel) => a.name.length - b.name.length);
                  data.repos[sr.id] = repos;

                }).catch((e) => {
                console.error(e);
              }))

          ]).then(() => {
            resolve(data);
          })
        }).catch((e) => {
        reject(e);
      });
    })
  }

  public loadUser (login: string): Promise<DataModel> {
    return new Promise<DataModel>((resolve, reject) => {
      let data: DataModel = new DataModel();

      /* user */
      this.get(`https://api.github.com/users/${login}`)
        .then((res) => {
          let user: UserModel = MapUtils.deserialize(UserModel, res.body);
          data.users.push(user);

          Promise.all([
            /* repos */
            this.get(user.organizations_url)
              .then((res) => {
                let orgs: OrgModel[] = MapUtils.deserializeCollection(OrgModel, res.body.slice(0, 3));

                orgs.sort((a: OrgModel, b: OrgModel) => a.login < b.login ? -1 : 1);
                data.orgs[user.id] = orgs;
              }).catch((e) => {
              console.log(e);
              reject(e);
            }),

            /* orgs */
            this.get(user.repos_url)
              .then((res) => {
                let repos: RepoModel[] = MapUtils.deserializeCollection(RepoModel, res.body.slice(0, 3));

                repos.sort((a: RepoModel, b: RepoModel) => a.name.length - b.name.length);
                data.repos[user.id] = repos;
              })
              .catch((e) => {
                console.log(e);
                reject(e);
              })
          ]).then(() => {
            resolve(data);
          }).catch((e) => {
            reject(e);
          });
        })
        .catch((e) => {
          reject(e);
          console.error(e);
        })
    })
  }

  private get (url: string): SuperAgentRequest {
    return request
      .get(url)
      .set('accept', 'json')
      .set('Origin', '')
  }
}

export default new UserApi();