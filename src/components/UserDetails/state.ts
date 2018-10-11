import RouterState from "../../routerState";
import UserDetails from "./UserDetails";

export default {
  name: RouterState.UserDetails,
  url: '/user/:login',
  component: UserDetails,
  resolve: [{
    token: 'login',
    deps: ['$transition$'],
    resolveFn: (trans) => trans.params().login
  }]
};
