import RouterState from "../../routerState";
import Landing from "./Landing";

export default {
  name: RouterState.Landing,
  url: '/{searchText:.*}',
  component: Landing,
  resolve: [{
    token: 'searchText',
    deps: ['$transition$'],
    resolveFn: (trans) => trans.params().searchText
  }]
};

