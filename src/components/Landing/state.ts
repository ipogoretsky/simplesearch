import RouterState from "../../routerState";
import Landing from "./Landing";

export default {
  name: RouterState.Landing,
  url: '/?{search:.*}',
  component: Landing,
  resolve: [{
    token: 'searchText',
    deps: ['$transition$'],
    resolveFn: (trans) => trans.params().search
  }]
};

