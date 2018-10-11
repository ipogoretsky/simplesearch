import * as React from "react";

interface IProps {
  userId: string
}

export default class UserDetails extends React.Component<IProps> {
  constructor (props: IProps) {
    super(props);

    console.log(props.userId);
  }

  public render () {
    return <div>user details...{this.props.userId}</div>;
  }
}