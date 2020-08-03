import React, { Component } from "react";
import Minesweeper from "./Minesweeper";
import { Menu } from "semantic-ui-react";
import "./stylesheets/App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: "easy" };
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  render = () => {
    const { activeItem } = this.state;
    return (
      <div className="App">
        <Menu widths="3">
          <Menu.Item
            name="easy"
            active={activeItem === "easy"}
            onClick={this.handleItemClick}
          >
            Easy
          </Menu.Item>

          <Menu.Item
            name="medium"
            active={activeItem === "medium"}
            onClick={this.handleItemClick}
          >
            Medium
          </Menu.Item>

          <Menu.Item
            name="expert"
            active={activeItem === "expert"}
            onClick={this.handleItemClick}
          >
            Expert
          </Menu.Item>
        </Menu>
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
        />
      </div>
    );
  };
}

export default App;
