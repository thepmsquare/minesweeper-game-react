import React, { Component } from "react";
import { Button, Icon, Label } from "semantic-ui-react";
import "./stylesheets/Minesweeper.css";
import { Dropdown } from "semantic-ui-react";

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
      win: false,
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
        win: false,
      });
    }
    if (previousProps === this.props) {
      this.state.clicked.forEach((tile) => {
        this.checkForZero(tile);
      });
    }
  };
  updateGrid = () => {
    document.querySelector(
      ".Minesweeper-tilesContainer"
    ).style.gridTemplateColumns = `repeat(${this.props.columns},3vh)`;
    document.querySelector(
      ".Minesweeper-tilesContainer"
    ).style.gridTemplateRows = `repeat(${this.props.rows},3vh)`;
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
            const target = this.state.calculatedClues
              .map((ele) => {
                return ele.position;
              })
              .filter((x) => !this.state.bombs.includes(x))
              .sort();
            const compareToTarget = this.state.clicked.sort();

            if (this.state.bombs.includes(newClickedPosition)) {
              this.setState({
                lose: true,
                clicked: this.state.calculatedClues.map((ele) => {
                  return ele.position;
                }),
                rightClick: [],
                secondRightClick: [],
              });
            } else if (
              JSON.stringify(target) === JSON.stringify(compareToTarget)
            ) {
              this.setState({ win: true });
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
    // not optimal
    let row = parseInt(e.target.getAttribute("row"));
    let col = parseInt(e.target.getAttribute("column"));
    let noBomb1 = `${row - 1}-${col - 1}`;
    let noBomb2 = `${row - 1}-${col}`;
    let noBomb3 = `${row - 1}-${col + 1}`;
    let noBomb4 = `${row}-${col - 1}`;
    let noBomb5 = `${row}-${col + 1}`;
    let noBomb6 = `${row + 1}-${col - 1}`;
    let noBomb7 = `${row + 1}-${col}`;
    let noBomb8 = `${row + 1}-${col + 1}`;
    for (let i = 1; i <= this.props.rows; i++) {
      for (let j = 1; j <= this.props.columns; j++) {
        if (
          i + "-" + j !== newClickedPosition &&
          i + "-" + j !== noBomb1 &&
          i + "-" + j !== noBomb2 &&
          i + "-" + j !== noBomb3 &&
          i + "-" + j !== noBomb4 &&
          i + "-" + j !== noBomb5 &&
          i + "-" + j !== noBomb6 &&
          i + "-" + j !== noBomb7 &&
          i + "-" + j !== noBomb8
        )
          bombOptions.push(i + "-" + j);
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
    if (
      !newClicked.includes(`${row - 1}-${col - 1}`) &&
      row - 1 > 0 &&
      row - 1 <= this.props.rows &&
      col - 1 > 0 &&
      col - 1 <= this.props.columns &&
      !this.state.rightClick.includes(`${row - 1}-${col - 1}`) &&
      !this.state.secondRightClick.includes(`${row - 1}-${col - 1}`)
    )
      newClicked.push(`${row - 1}-${col - 1}`);
    if (
      !newClicked.includes(`${row - 1}-${col}`) &&
      row - 1 > 0 &&
      row - 1 <= this.props.rows &&
      col > 0 &&
      col <= this.props.columns &&
      !this.state.rightClick.includes(`${row - 1}-${col}`) &&
      !this.state.secondRightClick.includes(`${row - 1}-${col}`)
    )
      newClicked.push(`${row - 1}-${col}`);
    if (
      !newClicked.includes(`${row - 1}-${col + 1}`) &&
      row - 1 > 0 &&
      row - 1 <= this.props.rows &&
      col + 1 > 0 &&
      col + 1 <= this.props.columns &&
      !this.state.rightClick.includes(`${row - 1}-${col + 1}`) &&
      !this.state.secondRightClick.includes(`${row - 1}-${col + 1}`)
    )
      newClicked.push(`${row - 1}-${col + 1}`);
    if (
      !newClicked.includes(`${row}-${col - 1}`) &&
      row > 0 &&
      row <= this.props.rows &&
      col - 1 > 0 &&
      col - 1 <= this.props.columns &&
      !this.state.rightClick.includes(`${row}-${col - 1}`) &&
      !this.state.secondRightClick.includes(`${row}-${col - 1}`)
    )
      newClicked.push(`${row}-${col - 1}`);
    if (
      !newClicked.includes(`${row}-${col + 1}`) &&
      row > 0 &&
      row <= this.props.rows &&
      col + 1 > 0 &&
      col + 1 <= this.props.columns &&
      !this.state.rightClick.includes(`${row}-${col + 1}`) &&
      !this.state.secondRightClick.includes(`${row}-${col + 1}`)
    )
      newClicked.push(`${row}-${col + 1}`);
    if (
      !newClicked.includes(`${row + 1}-${col - 1}`) &&
      row + 1 > 0 &&
      row + 1 <= this.props.rows &&
      col - 1 > 0 &&
      col - 1 <= this.props.columns &&
      !this.state.rightClick.includes(`${row + 1}-${col - 1}`) &&
      !this.state.secondRightClick.includes(`${row + 1}-${col - 1}`)
    )
      newClicked.push(`${row + 1}-${col - 1}`);
    if (
      !newClicked.includes(`${row + 1}-${col}`) &&
      row + 1 > 0 &&
      row + 1 <= this.props.rows &&
      col > 0 &&
      col <= this.props.columns &&
      !this.state.rightClick.includes(`${row + 1}-${col}`) &&
      !this.state.secondRightClick.includes(`${row + 1}-${col}`)
    )
      newClicked.push(`${row + 1}-${col}`);
    if (
      !newClicked.includes(`${row + 1}-${col + 1}`) &&
      row + 1 > 0 &&
      row + 1 <= this.props.rows &&
      col + 1 > 0 &&
      col + 1 <= this.props.columns &&
      !this.state.rightClick.includes(`${row + 1}-${col + 1}`) &&
      !this.state.secondRightClick.includes(`${row + 1}-${col + 1}`)
    )
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
      win: false,
    });
  };
  render = () => {
    const tiles = [];
    for (let i = 1; i <= this.props.rows; i++) {
      for (let j = 1; j <= this.props.columns; j++) {
        tiles.push([i, j]);
      }
    }
    const difficultyOptions = [
      {
        key: "easy",
        text: "Easy",
        value: "easy",
      },
      {
        key: "medium",
        text: "Medium",
        value: "medium",
      },
      {
        key: "hard",
        text: "Hard",
        value: "hard",
      },
    ];
    return (
      <div className="Minesweeper">
        <div className="Minesweeper-top">
          <Label>
            {!this.state.lose && !this.state.win
              ? parseInt(this.props.bombs) - this.state.rightClick.length
              : ""}
            {this.state.lose ? "You Lose" : ""}
            {this.state.win ? "Win" : ""}
          </Label>

          <Button onClick={this.handleRetry}>Retry</Button>
          <Dropdown
            placeholder="Difficulty"
            selection
            compact
            options={difficultyOptions}
            defaultValue="easy"
            onChange={this.props.dropdownOnChange}
          />
        </div>

        <div className="Minesweeper-tilesContainer">
          {tiles.map((tile, index) => {
            return (
              <Button
                key={tile.join("-")}
                row={tile[0]}
                column={tile[1]}
                index={index}
                basic={this.state.clicked.includes(tile.join("-"))}
                onClick={this.handleTileClick}
                onContextMenu={this.handleRightClick}
              >
                {/* show clues */}
                {this.state.clicked.includes(tile.join("-")) &&
                this.state.calculatedClues[index] &&
                !this.state.rightClick.includes(tile.join("-")) &&
                !this.state.secondRightClick.includes(tile.join("-")) &&
                this.state.calculatedClues[index].clue !== -1
                  ? this.state.calculatedClues[index].clue
                  : ""}
                {/* show bombs */}
                {this.state.bombs.includes(tile.join("-")) &&
                this.state.clicked.includes(tile.join("-")) ? (
                  <Icon color="red" name="bomb" />
                ) : (
                  ""
                )}
                {/* show flag */}
                {this.state.rightClick.includes(tile.join("-")) ? (
                  <Icon color="red" name="flag" />
                ) : (
                  ""
                )}
                {/* show qmark */}
                {this.state.secondRightClick.includes(tile.join("-")) ? (
                  <Icon name="question" />
                ) : (
                  ""
                )}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };
}

export default Minesweeper;
