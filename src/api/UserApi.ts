import {SearchResultModel} from "../models/SearchResultModel";
import MapUtils from "../utils/MapUtils";
import {RepoModel} from "../models/RepoModel";
import {UserModel} from "../models/User";
import * as request from "superagent";

class UserApi {

  public search (searchText: string | undefined): Promise<SearchResultModel[]> {
    return new Promise<SearchResultModel[]>((resolve, reject) => {
      request.get(`https://api.github.com/search/users?q=${searchText}+repos:%3E42+followers:%3E1000`)
        .set('accept', 'json')
        .then((res) => {
          let results: SearchResultModel[] = MapUtils.deserializeCollection(SearchResultModel, res.body.items);

          Promise.all([
            /* users */
            ...results.map((sr: SearchResultModel) => request
              .get('https://api.github.com/users/' + sr.login)
              .set('accept', 'json')
              .then((res) => {
                sr.user = MapUtils.deserialize(UserModel, res.body);
              }).catch((e) => {
                console.error(e);
              })),

            /* repos */
            ...results.map((sr: SearchResultModel) => request
              .get(sr.repos_url)
              .set('accept', 'json')
              .then((res) => {
                sr.repos = MapUtils.deserializeCollection(RepoModel, res.body.slice(0, 3));
                sr.repos.sort((a:RepoModel, b:RepoModel)=>a.name.length - b.name.length);
              }).catch((e) => {
                console.error(e);
              }))

          ]).then(() => {
            resolve(results);
          })
        }).catch((e) => {
        reject(e);
      });
    })
  }
}

export default new UserApi();