import * as React from "react";
import './UserPreview.css';
import {UserModel} from "../../models/UserModel";
import {RepoModel} from "../../models/RepoModel";
import RouterState from "../../routerState";
import {UIRouterLink} from "../../utils/UIRouterLink";

export enum UserPreviewMode {
  Default,
  Card
}

interface IProps {
  mode: UserPreviewMode,
  user: UserModel,
  repos: RepoModel[]
}

export class UserPreview extends React.Component<IProps> {
  private static defaultProps: IProps = {
    mode: UserPreviewMode.Default,
    user: new UserModel(),
    repos: []
  }

  constructor (props: IProps) {
    super(props);
  }

  public render () {
    switch (this.props.mode) {
      case UserPreviewMode.Default: {
        return <React.Fragment>
          <div className='user-preview user-preview-default'>
            <div className='user-preview-basic-info'>
              <img src={this.props.user.avatar_url}/>
              <div>
                <UIRouterLink to={RouterState.UserDetails} params={{login: this.props.user.login}}>
                  {this.props.user.name}
                </UIRouterLink><br/>
                <span>{this.props.user.type} </span>
              </div>
            </div>

            <div className='user-preview-items'>
              <div className='caption'>REPOSITORIES</div>

              {this.props.repos.length == 0 &&
              <div className='no-result'>NO REPOSITORIES TO DISPLAY</div>
              }

              {this.props.repos.map((rep: RepoModel, i: number) => {
                return (<div key={rep.id}>
                  <a target="_blank"
                     href={rep.html_url}>{rep.name}</a>
                </div>)
              })}
            </div>
          </div>
        </React.Fragment>
      }

      case UserPreviewMode.Card: {
        return <React.Fragment>
          <div className='user-preview user-preview-card'>
            <div className='user-preview-card-content'>
              <div className='user-preview-basic-info'>
                <img src={this.props.user.avatar_url}/>
                <div>
                  <UIRouterLink to={RouterState.UserDetails} params={{login: this.props.user.login}}>
                    {this.props.user.name}
                  </UIRouterLink><br/>
                  <span>{this.props.user.type} </span>
                </div>
              </div>

              <div className='user-preview-items'>
                <div className='caption'>REPOSITORIES</div>

                {this.props.repos.length == 0 &&
                <div className='no-result'>NO REPOSITORIES TO DISPLAY</div>
                }

                {this.props.repos.map((rep: RepoModel, i: number) => {
                  return (<div key={rep.id}>
                    <a target="_blank"
                       href={rep.html_url}>{rep.name}</a>
                  </div>)
                })}
              </div>
            </div>
          </div>

        </React.Fragment>
      }
    }
  }
}