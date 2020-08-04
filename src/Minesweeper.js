import React, { Component } from "react";
import "./stylesheets/Minesweeper.css";

class Minesweeper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstClickDone: false,
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
        firstClickDone: false,
        bombs: [],
        clicked: [],
        calculatedClues: [],
      });
    }
    this.state.clicked.forEach((tile) => {
      this.checkForZero(tile);
    });
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
    const newClicked = [...this.state.clicked];
    if (!newClicked.includes(newClickedPosition)) {
      newClicked.push(newClickedPosition);
    }
    this.setState(
      {
        clicked: newClicked,
      },
      () => {
        if (this.state.firstClickDone) {
          this.checkForZero(e);
        } else {
          this.handleFirstClick(e, newClickedPosition);
        }
      }
    );
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
        firstClickDone: true,
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
      calculatedClues.push({ position: tiles[i].join("-"), clue: temp });
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
    if (typeof e === "object") {
      if (
        this.state.calculatedClues[e.target.getAttribute("index")].clue === 0
      ) {
        let row = parseInt(e.target.getAttribute("row"));
        let col = parseInt(e.target.getAttribute("column"));
        this.clickNeighbours(row, col);
      }
    } else if (typeof e === "string") {
      if (
        this.state.calculatedClues.find((ele) => {
          return ele.position === e;
        })
      ) {
        if (
          this.state.calculatedClues.find((ele) => {
            return ele.position === e;
          }).clue === 0
        ) {
          let row = parseInt(e.split("-")[0]);
          let col = parseInt(e.split("-")[1]);
          this.clickNeighbours(row, col);
        }
      }
    }
  };
  clickNeighbours = (row, col) => {
    const newClicked = [...this.state.clicked];
    if (!newClicked.includes(`${row - 1}-${col - 1}`))
      newClicked.push(`${row - 1}-${col - 1}`);
    if (!newClicked.includes(`${row - 1}-${col}`))
      newClicked.push(`${row - 1}-${col}`);
    if (!newClicked.includes(`${row - 1}-${col + 1}`))
      newClicked.push(`${row - 1}-${col + 1}`);
    if (!newClicked.includes(`${row}-${col - 1}`))
      newClicked.push(`${row}-${col - 1}`);
    if (!newClicked.includes(`${row}-${col + 1}`))
      newClicked.push(`${row}-${col + 1}`);
    if (!newClicked.includes(`${row + 1}-${col - 1}`))
      newClicked.push(`${row + 1}-${col - 1}`);
    if (!newClicked.includes(`${row + 1}-${col}`))
      newClicked.push(`${row + 1}-${col}`);
    if (!newClicked.includes(`${row + 1}-${col + 1}`))
      newClicked.push(`${row + 1}-${col + 1}`);
    if (this.state.clicked.length !== newClicked.length) {
      this.setState(() => {
        return {
          clicked: newClicked,
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
            >
              {this.state.clicked.includes(tile.join("-")) &&
              this.state.calculatedClues[index]
                ? this.state.calculatedClues[index].clue
                : ""}
            </div>
          );
        })}
      </div>
    );
  };
}

export default Minesweeper;
