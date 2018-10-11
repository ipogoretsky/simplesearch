import {hashLocationPlugin, servicesPlugin, UIRouterReact} from '@uirouter/react';
import * as landing from "./components/Landing/state";
import * as userDetails from "./components/UserDetails/state";

import RouterState from "./routerState";

let router = new UIRouterReact();
router.plugin(servicesPlugin);
router.plugin(hashLocationPlugin);

const states = [landing, userDetails];

states.forEach(state => router.stateRegistry.register(state.default));

router.urlService.rules.initial({state: RouterState.Landing});
router.urlService.rules.otherwise({state: RouterState.UserDetails});

export default router;
