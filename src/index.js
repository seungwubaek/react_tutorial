import React from "react";
import ReactDOM from "react-dom";
import './index.css'

// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const getBoardDiv = () => {
      const rows = [];
      for(let i=0; i<3; i++) { // rows
        const row = [];
        for(let j=0; j<3; j++) { // cols
          row.push(this.renderSquare(i*3+j));
        }
        rows.push(<div key={i} className="board-row">{row}</div>)
      }
      return <div>{rows}</div>
    }
    return getBoardDiv();
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        squaresIdx: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      sortAscd: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        squaresIdx: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const historyForMoves = this.state.sortAscd ? this.state.history.slice(0) : this.state.history.slice(0).reverse();
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = historyForMoves.map((step, move) => {
      move = (this.state.sortAscd ? move : history.length-1-move);
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={move===this.state.stepNumber ? {fontWeight: "bold"}:{}}
          >
            {desc}
          </button>
          {move ? <span>({parseInt(step.squaresIdx/3)+1}, {step.squaresIdx%3+1})</span> : null}
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="sort-btn">
            <span>Sort: </span>
            <button onClick={() => this.setState({sortAscd: !this.state.sortAscd})}>
              {this.state.sortAscd ? '오름차순' : '내림차순'}
            </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
