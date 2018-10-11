import * as React from "react";
import './Landing.css';
import {Search} from "../../common/Search/Search";
import UserApi from "../../api/UserApi";
import RouterState from "../../routerState";
import router from "../../router";
import {DataModel} from "../../models/DataModel";
import {UserModel} from "../../models/UserModel";
import {UserPreview, UserPreviewMode} from "../../common/UserPreview/UserPreview";
import {_cs} from "../../utils/helpers";
import LocalDataHelper from "../../data/LocalDataHelper";

interface IProps {
  searchText: string | undefined
}

interface IState {
  mode: UserPreviewMode,
  searched: boolean,
  isPendingSearch: boolean,
  dataModel: DataModel,
}

export default class Landing extends React.Component<IProps, IState> {

  constructor (props: IProps) {
    super(props);

    this.state = {
      searched: false,
      mode: LocalDataHelper.userPreviewMode,
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
    if (this.props.searchText == searchText)
      this.search(searchText)
    else
      router.stateService.go(RouterState.Landing, {search: searchText});
  }

  private search (searchText: string | undefined) {
    this.setState({isPendingSearch: true});

    UserApi.search(searchText)
      .then((dataModel: DataModel) => {
        this.setState({
          searched: true,
          isPendingSearch: false,
          dataModel: dataModel
        });

      }).catch((e) => {

      this.setState({
        isPendingSearch: false,
      });
    })
  }

  private toggleMode (mode: UserPreviewMode) {
    LocalDataHelper.userPreviewMode = mode;
    this.setState({mode: mode});
  }

  public render () {
    return (<React.Fragment>
      <h3 className='page-caption'>GitHub Users Search</h3>

      <Search isPending={this.state.isPendingSearch}
              searchText={this.props.searchText}
              onSearch={(s: string) => this.onSearch(s)}/>

      {this.state.isPendingSearch &&
      <div className='spinner-bar'>
        <div className='spinner'>Searching...</div>
      </div>
      }

      {/*Toolbar*/}
      <div className='toolbar'>
        <div className='toolbar-text'>
          GitHub most popular users

          {this.state.searched &&
          <div>Found:{this.state.dataModel.users.length} users</div>
          }
        </div>

        <div className='toolbar-buttons'>
          <div className={_cs('toolbar-button',
            {'toolbar-button-active': this.state.mode == UserPreviewMode.Default})}
               onClick={() => this.toggleMode(UserPreviewMode.Default)}>

            <span className='fa fa-list-ul'/>
          </div>
          <div className={_cs('toolbar-button',
            {'toolbar-button-active': this.state.mode == UserPreviewMode.Card})}
               onClick={() => this.toggleMode(UserPreviewMode.Card)}>

            <span className='fa fa-table'/>
          </div>
        </div>
      </div>

      {/*Users List*/}
      <div className="shadow-box">

        {!this.state.isPendingSearch && this.state.searched && !this.state.dataModel.users.length &&
        <div className='no-result'>Users not found...</div>
        }
        <div className={_cs({
          'user-list-cards': this.state.mode == UserPreviewMode.Card
        })}>

          {this.state.dataModel.users.map((user: UserModel) => {
            return (
              <UserPreview
                key={user.id}
                mode={this.state.mode}
                user={user}
                repos={this.state.dataModel.repos[user.id]}/>
            )
          })}
        </div>
      </div>
    </React.Fragment>);
  }
}