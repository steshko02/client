import React, { Component } from "react";
import AuthService from "../services/auth.service";


const currentUser = AuthService.getCurrentUser()

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }


  render() {
    return (
      <div className="container">
         <header className="jumbotron">
           <h3>{currentUser.sub}</h3>
        </header> 
      </div>
    );
  }
}
