import * as React from "react";
import './UserDetails.css';
import UserApi from "../../api/UserApi";
import {DataModel} from "../../models/DataModel";
import {UIRouterLink} from "../../utils/UIRouterLink";
import RouterState from "../../routerState";
import {RepoModel} from "../../models/RepoModel";
import {OrgModel} from "../../models/OrgModel";
import {_cs} from "../../utils/helpers";

interface IProps {
  login: string
}

interface IState {
  searched: boolean,
  isPendingSearch: boolean,
  dataModel: DataModel
}

export default class UserDetails extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);

    this.state = {
      searched: false,
      isPendingSearch: false,
      dataModel: new DataModel()
    }
  }

  componentDidMount () {
    this.setState({isPendingSearch: true});

    UserApi.loadUser(this.props.login)
      .then((dataModel: DataModel) => {
        this.setState({
          searched: true,
          dataModel: dataModel
        })
      })
      .catch(() => {
        console.log("err");
        this.setState({
          isPendingSearch: false,
          searched: true
        })
      });
  }

  public render () {
    if (!this.state.dataModel.users.length) {
      return <React.Fragment>

        {this.state.isPendingSearch &&
        <div className='loading'></div>
        }

        {this.state.searched &&
        <div className='no-result'>User not found</div>}

      </React.Fragment>;
    }

    return <React.Fragment>
      <div className='user-details'>
        <div className='user-details-nav'>
          <UIRouterLink to={RouterState.Landing}>Back to search</UIRouterLink>
          <div>{this.state.dataModel.users[0].login}</div>
        </div>

        <br/>
        <div className='shadow-box'>
          <div className='user-details-user-preview-basic-info'>
            <img src={this.state.dataModel.singleUser!.avatar_url}/>
            <div>
              <div>
                {this.state.dataModel.singleUser!.name}
              </div>
              <span>{this.state.dataModel.singleUser!.type} </span>
            </div>
          </div>


          <div className='user-details-user-preview-items'>
            <div className='caption'>REPOSITORIES</div>

            {this.state.dataModel.singleUserRepos.length == 0 &&
            <div className='no-result'>NO REPOSITORIES TO DISPLAY</div>
            }

            {this.state.dataModel.singleUserRepos.map((rep: RepoModel, i: number) => {
              return (<div key={rep.id}>
                <a target="_blank"
                   href={rep.html_url}>{rep.name}</a>
              </div>)
            })}
          </div>

          <div className='user-details-user-preview-items'>
            <div className='caption'>ORGANIZATIONS</div>

            {this.state.dataModel.singleUserOrgs.length == 0 &&
            <div className='no-result'>NO ORGANIZATIONS TO DISPLAY</div>
            }

            {this.state.dataModel.singleUserOrgs.map((org: OrgModel, i: number) => {
              return (<div key={org.id}>
                <img src={org.avatar_url}/>
                <div><a target="_blank" href={`https://github.com/${org.login}`}>{org.login}</a>
                </div>
              </div>)
            })}
          </div>

        </div>
        <br/>
      </div>

    </React.Fragment>;
  }
}