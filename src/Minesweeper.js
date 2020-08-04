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
      rightClick: [],
      secondRightClick: [],
      lose: false,
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
        rightClick: [],
        secondRightClick: [],
        lose: false,
      });
    }
    this.state.clicked.forEach((tile) => {
      this.checkForZero(tile);
    });
  };

  updateGrid = () => {
    document.querySelector(
      ".Minesweeper-tilesContainer"
    ).style.gridTemplateColumns = `repeat(${this.props.columns},1fr)`;
  };

  handleTileClick = (e) => {
    e.persist();
    let newClickedPosition =
      e.target.getAttribute("row") + "-" + e.target.getAttribute("column");
    if (
      !this.state.rightClick.includes(newClickedPosition) &&
      !this.state.secondRightClick.includes(newClickedPosition)
    ) {
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
            if (this.state.bombs.includes(newClickedPosition)) {
              this.setState({
                lose: true,
                clicked: this.state.calculatedClues.map((ele) => {
                  return ele.position;
                }),
                rightClick: [],
                secondRightClick: [],
              });
            } else if (false) {
            } else {
              this.checkForZero(e);
            }
          } else {
            this.handleFirstClick(e, newClickedPosition);
          }
        }
      );
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
  handleRightClick = (e) => {
    e.preventDefault();
    let row = parseInt(e.target.getAttribute("row"));
    let col = parseInt(e.target.getAttribute("column"));
    let position = `${row}-${col}`;
    const newRightClicked = [...this.state.rightClick];
    const newSecondRightClicked = [...this.state.secondRightClick];

    if (
      !this.state.clicked.includes(position) &&
      !newRightClicked.includes(position) &&
      !newSecondRightClicked.includes(position)
    ) {
      newRightClicked.push(position);
      this.setState({
        rightClick: newRightClicked,
      });
    } else if (
      !this.state.clicked.includes(position) &&
      newRightClicked.includes(position) &&
      !newSecondRightClicked.includes(position)
    ) {
      newRightClicked.splice(
        newRightClicked.findIndex((ele) => {
          return ele === position;
        }),
        1
      );
      newSecondRightClicked.push(position);
      this.setState({
        rightClick: newRightClicked,
        secondRightClick: newSecondRightClicked,
      });
    } else if (
      !this.state.clicked.includes(position) &&
      !newRightClicked.includes(position) &&
      newSecondRightClicked.includes(position)
    ) {
      newSecondRightClicked.splice(
        newSecondRightClicked.findIndex((ele) => {
          return ele === position;
        }),
        1
      );
      this.setState({
        secondRightClick: newSecondRightClicked,
      });
    }
  };
  handleRetry = () => {
    this.setState({
      firstClickDone: false,
      bombs: [],
      clicked: [],
      calculatedClues: [],
      rightClick: [],
      secondRightClick: [],
      lose: false,
    });
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
        <div className="Minesweeper-tilesContainer">
          {tiles.map((tile, index) => {
            return (
              <button
                key={tile.join("-")}
                row={tile[0]}
                column={tile[1]}
                className="Minesweeper-tile"
                index={index}
                onClick={this.handleTileClick}
                onContextMenu={this.handleRightClick}
              >
                {this.state.clicked.includes(tile.join("-")) &&
                this.state.calculatedClues[index]
                  ? this.state.calculatedClues[index].clue
                  : ""}
                {this.state.rightClick.includes(tile.join("-")) ? "Flag" : ""}
                {this.state.secondRightClick.includes(tile.join("-"))
                  ? "?"
                  : ""}
              </button>
            );
          })}
        </div>
        <div>
          {this.state.lose === false
            ? `${
                parseInt(this.props.bombs) - this.state.rightClick.length
              } bombs
     remaining`
            : ""}
          {this.state.lose ? "You Lose" : ""}
          <button onClick={this.handleRetry}>retry</button>
        </div>
      </div>
    );
  };
}

export default Minesweeper;
