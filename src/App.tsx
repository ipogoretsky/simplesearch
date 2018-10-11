import * as React from 'react';
import './App.css';
import {SearchResultModel} from "./models/SearchResultModel";
import {pushStateLocationPlugin, UIRouter, UIView,} from '@uirouter/react';
import router from "./router";

interface IState {
  isPendingSearch: boolean,
  searchResults: SearchResultModel[]
}

class App extends React.Component {
  constructor (props) {
    super(props);
  }

  public render () {
    return (
      <UIRouter plugins={[pushStateLocationPlugin]} router={router}>
        <div className="page">
          <div className="page-badge"></div>
          <UIView/>
        </div>
      </UIRouter>
    );
  }
}

export default App;
