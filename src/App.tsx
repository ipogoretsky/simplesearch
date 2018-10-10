import * as React from 'react';
import './App.css';
import {SearchResultModel} from "./models/SearchResultModel";
import {RepoModel} from "./models/RepoModel";
import UserApi from "./api/UserApi";

interface IState {
  isLoading: boolean,
  searchText: string | undefined,
  searchResults: SearchResultModel[]
}

class App extends React.Component<{}, IState> {
  constructor (props) {
    super(props);

    this.state = {
      searchResults: [],
      searchText: 'tom',
      isLoading: false
    }
  }

  private onSearch () {
    this.setState({isLoading: true});

    UserApi.search(this.state.searchText)
      .then((results: SearchResultModel[]) => {
        this.setState({
          isLoading: false,
          searchResults: results
        });

      }).catch((e) => {

      this.setState({
        isLoading: false
      });
    })
  }

  private onChange (e) {
    this.setState({
      searchText: e.target.value
    })
  }

  public render () {
    return (
      <div className="page">
        <div className="page-badge"></div>
        <h3 className='page-caption'>GitHub Users Search </h3>
        <div className='search'>
          <div className='search-control'>
            <input value={this.state.searchText}
                   type="text"
                   className='search-control-input'
                   onChange={(e) => this.onChange(e)}
                   placeholder='Search GitHub users...'/>

            <button type='button'
                    className='search-control-button'
                    onClick={() => this.onSearch()}>Find
            </button>
          </div>

          {this.state.isLoading &&
          <div>searching...</div>
          }

          <ul className='search-last'>
            <li><a href='#'>Last search 1</a></li>
            <li><a href='#'>Last search 1</a></li>
            <li><a href='#'>Last search 1</a></li>
          </ul>

        </div>

        <br/><br/><br/>

        <div className='search-result'>
          <h3>Search result</h3>
          <div className="shadow-box">

            {!this.state.searchResults.length && !this.state.isLoading &&
            <div><h5>No Result</h5></div>
            }

            {this.state.searchResults.map((sr: SearchResultModel) => {
              return (
                <div key={sr.id} className='user-preview'>

                  <div className='user-preview-basic-info'>
                    <img src={sr.avatar_url}/>
                    <div>
                      <a href=''>{sr.user.name}</a><br/>
                      <span>{sr.user.type} </span>
                    </div>
                  </div>

                  <div className='user-preview-repos'>
                    <div>REPOSITORIES</div>

                    {sr.repos.map((rep: RepoModel) => {
                      return (<div>
                        <a key={rep.id}
                           target="_blank"
                           href={rep.html_url}>{rep.name}</a>
                      </div>)
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
