import React, { Component } from "react";
import "./stylesheets/Minesweeper.css";

class Minesweeper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstClick: false,
      bombs: [],
      clicked: [],
      calculatedClues: [],
    };
  }

  componentDidMount = () => {
    this.updateGrid();
  };

  componentDidUpdate = (previousProps, previousState) => {
    this.updateGrid();
    if (previousProps !== this.props) {
      this.setState({
        firstClick: false,
        bombs: [],
        clicked: [],
        calculatedClues: [],
      });
    }
  };

  updateGrid = () => {
    document.querySelector(
      ".Minesweeper"
    ).style.gridTemplateColumns = `repeat(${this.props.columns},1fr)`;
  };

  handleTileClick = (e) => {
    e.persist();
    let newClickedPosition =
      e.target.getAttribute("row") + "-" + e.target.getAttribute("column");
    const newClicked = [...this.state.clicked, newClickedPosition];
    this.setState({
      clicked: newClicked,
    });
    if (this.state.firstClick) {
      this.checkForZero(e);
    } else {
      this.handleFirstClick(e, newClickedPosition);
    }
  };

  handleFirstClick = (e, newClickedPosition) => {
    let bombOptions = [];
    for (let i = 1; i <= this.props.rows; i++) {
      for (let j = 1; j <= this.props.columns; j++) {
        if (i + "-" + j !== newClickedPosition) bombOptions.push(i + "-" + j);
      }
    }
    const bombs = [];
    while (bombs.length < this.props.bombs) {
      let chosenIndex = [Math.floor(Math.random() * bombOptions.length)];
      bombs.push(bombOptions[chosenIndex]);
      bombOptions.splice(chosenIndex, 1);
    }
    this.setState(
      {
        firstClick: true,
        bombs: bombs,
      },
      () => {
        this.calculateClues(e);
      }
    );
  };

  calculateClues = (e) => {
    const tiles = [];
    for (let i = 1; i <= this.props.rows; i++) {
      for (let j = 1; j <= this.props.columns; j++) {
        tiles.push([i, j]);
      }
    }
    const calculatedClues = [];
    for (let i = 0; i < tiles.length; i++) {
      let temp = 0;
      if (this.state.bombs.includes(tiles[i].join("-"))) {
        temp = -1;
      } else {
        if (
          this.state.bombs.includes(`${tiles[i][0] - 1}-${tiles[i][1] - 1}`)
        ) {
          temp = temp + 1;
        }
        if (this.state.bombs.includes(`${tiles[i][0] - 1}-${tiles[i][1]}`)) {
          temp = temp + 1;
        }
        if (
          this.state.bombs.includes(`${tiles[i][0] - 1}-${tiles[i][1] + 1}`)
        ) {
          temp = temp + 1;
        }
        if (this.state.bombs.includes(`${tiles[i][0]}-${tiles[i][1] - 1}`)) {
          temp = temp + 1;
        }
        if (this.state.bombs.includes(`${tiles[i][0]}-${tiles[i][1] + 1}`)) {
          temp = temp + 1;
        }
        if (
          this.state.bombs.includes(`${tiles[i][0] + 1}-${tiles[i][1] - 1}`)
        ) {
          temp = temp + 1;
        }
        if (this.state.bombs.includes(`${tiles[i][0] + 1}-${tiles[i][1]}`)) {
          temp = temp + 1;
        }
        if (
          this.state.bombs.includes(`${tiles[i][0] + 1}-${tiles[i][1] + 1}`)
        ) {
          temp = temp + 1;
        }
      }
      calculatedClues.push({ [tiles[i].join("-")]: temp });
    }

    this.setState(
      {
        calculatedClues: calculatedClues,
      },
      () => {
        this.checkForZero(e);
      }
    );
  };
  checkForZero = (e) => {
    if (
      this.state.calculatedClues[e.target.getAttribute("index")][
        `${e.target.getAttribute("row")}-${e.target.getAttribute("column")}`
      ] === 0
    ) {
      const newClicked = [];
      let row = parseInt(e.target.getAttribute("row"));
      let col = parseInt(e.target.getAttribute("column"));
      newClicked.push(`${row - 1}-${col - 1}`);
      newClicked.push(`${row - 1}-${col}`);
      newClicked.push(`${row - 1}-${col + 1}`);
      newClicked.push(`${row}-${col - 1}`);
      newClicked.push(`${row}-${col + 1}`);
      newClicked.push(`${row + 1}-${col - 1}`);
      newClicked.push(`${row + 1}-${col}`);
      newClicked.push(`${row + 1}-${col + 1}`);
      this.setState((curState) => {
        return {
          clicked: [...curState.clicked, ...newClicked],
        };
      });
    }
  };
  render = () => {
    const tiles = [];
    for (let i = 1; i <= this.props.rows; i++) {
      for (let j = 1; j <= this.props.columns; j++) {
        tiles.push([i, j]);
      }
    }
    return (
      <div className="Minesweeper">
        {tiles.map((tile, index) => {
          return (
            <div
              key={tile.join("-")}
              row={tile[0]}
              column={tile[1]}
              className="Minesweeper-tile"
              index={index}
              onClick={this.handleTileClick}
              style={{
                backgroundColor: "cyan",
              }}
            >
              {this.state.clicked.includes(tile.join("-")) &&
              this.state.calculatedClues[index]
                ? this.state.calculatedClues[index][tile.join("-")]
                : ""}
            </div>
          );
        })}
      </div>
    );
  };
}

export default Minesweeper;
