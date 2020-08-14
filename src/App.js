import React, { Component } from "react";
import Minesweeper from "./Minesweeper";

import "./stylesheets/App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "easy" };
  }

  handleItemClick = (e, data) => {
    this.setState({ activeItem: data.value });
  };
  render = () => {
    return (
      <div className="App">
        <Minesweeper
          rows={
            this.state.activeItem === "easy"
              ? 9
              : this.state.activeItem === "medium"
              ? 16
              : 30
          }
          columns={
            this.state.activeItem === "easy"
              ? 9
              : this.state.activeItem === "medium"
              ? 16
              : 16
          }
          bombs={
            this.state.activeItem === "easy"
              ? 10
              : this.state.activeItem === "medium"
              ? 40
              : 99
          }
          dropdownOnChange={this.handleItemClick}
        />
      </div>
    );
  };
}

export default App;
