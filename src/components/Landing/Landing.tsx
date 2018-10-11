import * as React from "react";
import './Landing.css';
import {Search} from "../../common/Search/Search";
import UserApi from "../../api/UserApi";
import {RepoModel} from "../../models/RepoModel";
import RouterState from "../../routerState";
import router from "../../router";
import {UIRouterLink} from "../../utils/UIRouterLink";
import {DataModel} from "../../models/DataModel";
import {UserModel} from "../../models/UserModel";

interface IProps {
  searchText: string | undefined
}

interface IState {
  isPendingSearch: boolean,
  dataModel: DataModel,
}

export default class Landing extends React.Component<IProps, IState> {

  constructor (props: IProps) {
    super(props);

    this.state = {
      isPendingSearch: false,
      dataModel: new DataModel()
    }
  }

  componentDidMount () {
    this.search(this.props.searchText);
  }

  componentWillReceiveProps (nextProps: IProps) {
    if (nextProps.searchText != this.props.searchText) {
      this.search(nextProps.searchText);
    }
  }

  private onSearch (searchText: string | undefined) {
    router.stateService.go(RouterState.Landing, {search: searchText});
  }

  private search (searchText: string | undefined) {
    this.setState({isPendingSearch: !!searchText});

    UserApi.search(searchText)
      .then((dataModel: DataModel) => {
        this.setState({
          isPendingSearch: false,
          dataModel: dataModel
        });

      }).catch((e) => {

      this.setState({
        isPendingSearch: false
      });
    })
  }

  public render () {
    return (<React.Fragment>
      <h3 className='page-caption'>GitHub Users Search</h3>

      <Search isPending={this.state.isPendingSearch}
              searchText={this.props.searchText}
              onSearch={(s: string) => this.onSearch(s)}/>

      <div className='search-result'>
        <h4>GitHub most popular users</h4>
        <div className="shadow-box">

          {!this.state.dataModel.users && !this.state.isPendingSearch &&
          <div><h5>No Result</h5></div>
          }

          {this.state.dataModel.users.map((user: UserModel) => {
            return (
              <div key={user.id} className='user-preview'>

                <div className='user-preview-basic-info'>
                  <img src={user.avatar_url}/>
                  <div>
                    <UIRouterLink to={RouterState.UserDetails} params={{login: user.login}}>
                      {user.name}
                    </UIRouterLink><br/>
                    <span>{user.type} </span>
                  </div>
                </div>

                <div className='user-preview-repos'>
                  <div>REPOSITORIES</div>

                  {this.state.dataModel.repos[user.id].map((rep: RepoModel, i: number) => {
                    return (<div key={rep.id}>
                      <a target="_blank"
                         href={rep.html_url}>{rep.name}</a>
                    </div>)
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </React.Fragment>);
  }
}