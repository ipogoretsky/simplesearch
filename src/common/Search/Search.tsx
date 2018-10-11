import './Search.css'
import * as React from "react";
import LocalDataHelper from "../../data/LocalDataHelper";
import {UIRouterLink} from "../../utils/UIRouterLink";
import RouterState from "../../routerState";

interface IProps {
  searchText?: string;
  isPending: boolean;
  onSearch: (searchText: string | undefined) => void;
}

interface IState {
  lastSearch: string[],
  searchText: string | undefined
}

export class Search extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);

    this.state = {
      lastSearch: LocalDataHelper.lastSearch,
      searchText: this.props.searchText || 'tom'
    }
  }

  componentWillReceiveProps (nextProps: IProps) {
    if (nextProps.searchText != this.props.searchText) {
      this.setState({
        searchText: nextProps.searchText
      });
    }
  }

  private onSearch () {
    let s: string = (this.state.searchText || '').trim();

    LocalDataHelper.addSearchText(s);
    this.props.onSearch(s);

    this.setState({
      lastSearch: LocalDataHelper.lastSearch
    })
  }

  private onChange (e) {
    this.setState({
      searchText: e.target.value
    })
  }

  private onKeyDown (e) {
    if (e.key && e.key == 'Enter') {
      this.onSearch();
    }
  }

  public render () {
    return (
      <React.Fragment>
        <div className='search'>
          <div className='search-control'>
            <input value={this.state.searchText}
                   type="text"
                   disabled={this.props.isPending}
                   onKeyDown={(e) => this.onKeyDown(e)}
                   className='search-control-input'
                   onChange={(e) => this.onChange(e)}
                   placeholder='Search GitHub users...'/>

            <button type='button'
                    disabled={this.props.isPending}
                    className='search-control-button'
                    onClick={() => this.onSearch()}>Find
            </button>
          </div>

          {this.props.isPending &&
          <div>searching...</div>
          }

          <ul className='search-last'>
            <li>Last searches:</li>
            {this.state.lastSearch.map((s: string) => {
              return <li key={s}>
                <UIRouterLink to={RouterState.Landing} params={{searchText: s}}>
                  {s}
                </UIRouterLink>
              </li>
            })}
          </ul>

        </div>
      </React.Fragment>
    );
  }

}