import RouterState from "../../routerState";
import UserDetails from "./UserDetails";

export default {
  name: RouterState.UserDetails,
  url: '/user/:id',
  component: UserDetails,
  resolve: [{
    token: 'userId',
    deps: ['$transition$'],
    resolveFn: (trans) => trans.params().id
  }]
};
