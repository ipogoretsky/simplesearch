import * as React from "react";
import UserApi from "../../api/UserApi";
import {DataModel} from "../../models/DataModel";

interface IProps {
  login: string
}

export default class UserDetails extends React.Component<IProps> {
  constructor (props: IProps) {
    super(props);
  }

  componentDidMount () {
    UserApi.loadUser(this.props.login).then((data: DataModel) => {
      console.log('loaded user', data);
    });
  }

  public render () {
    return <div>user details...{this.props.login}</div>;
  }
}