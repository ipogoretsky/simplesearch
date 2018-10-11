import * as React from 'react';
import {UISref, UISrefActive} from '@uirouter/react';

interface IUIRouterLinkProps {
  to: string;
  className?: string;
  params?: {
    [key: string]: any;
  };
}

export class UIRouterLink extends React.Component<IUIRouterLinkProps> {

  public render () {
    return <UISrefActive class={"active"}>
      <UISref to={this.props.to} params={this.props.params}>
        <a>{this.props.children}</a>
      </UISref>
    </UISrefActive>;
  }
}
