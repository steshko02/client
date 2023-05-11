import React, { Component } from "react";

import EventBus from "../common/EventBus";

export default class BoardModerator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "Moderator"
    };
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
      </div>
    );
  }
}
