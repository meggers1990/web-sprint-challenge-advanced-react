import React from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at
const initialWinMessage = "";

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
  winMessage: initialWinMessage,
  errorMessage: "",
  coordinates: "",
};

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor() {
    super();
    this.state = initialState;
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let x = (this.state.index % 3) + 1;
    let y = Math.floor(this.state.index / 3) + 1;
    return [x, y];
  };

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coordinates = this.getXY();

    return `Coordinates (${coordinates})`;
  };

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(
      {
        ...this.state,
        email: initialEmail,
        message: initialMessage,
        index: initialIndex,
        steps: initialSteps,
      },
      () => {
        const initialCoordinates = this.getXYMessage();
        this.setState({
          ...this.state,
          coordinates: initialCoordinates,
        });
      }
    );
  };

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let coordinates = this.getXY();
    let currentIndex = this.state.index;
    let newIndex = this.state.index;

    if (direction === "left" && coordinates[0] > 1) {
      // coordinates = [coordinates[0] - 1, coordinates[1]];
      newIndex -= 1;
      return newIndex;
    }
    if (direction === "up" && coordinates[1] > 1) {
      // coordinates = [coordinates[0], coordinates[1] - 1];
      newIndex -= 3;
      return newIndex;
    }
    if (direction === "right" && coordinates[0] < 3) {
      // coordinates = [coordinates[0] + 1, coordinates[1]];
      newIndex += 1;
      return newIndex;
    }

    if (direction === "down" && coordinates[1] < 3) {
      // coordinates = [coordinates[0], coordinates[1] + 1];
      newIndex += 3;
      return newIndex;
    }
    return currentIndex;
  };

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    evt.preventDefault();
    let direction = evt.target.id;
    let newIndex = this.getNextIndex(direction);
    let currentSteps =
      this.state.index !== newIndex ? this.state.steps + 1 : this.state.steps;
    let coordinates = this.getXY();
    let directionMessage = `You can't go ${direction}`;

    this.setState(
      {
        ...this.state,
        index: newIndex,
        steps: currentSteps,
        message: this.state.index === newIndex ? directionMessage : "",
      },
      () => {
        let newCoordinates = this.getXYMessage();
        this.setState({
          ...this.state,
          coordinates: newCoordinates,
        });
      }
    );
  };

  onChange = (evt) => {
    // You will need this to update the value of the input.
    const value = evt.target.value;
    this.setState({ ...this.state, email: value });
  };

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const coordinates = this.getXY();
    let payload = {
      x: coordinates[0],
      y: coordinates[1],
      steps: this.state.steps,
      email: this.state.email,
    };

    axios
      .post("http://localhost:9000/api/result", payload)
      .then((res) =>
        this.setState({
          ...this.state,
          message: res.data.message,
          email: initialEmail,
        })
      )
      .catch((err) =>
        this.setState({
          ...this.state,
          errorMessage: err.response.data.message,
        })
      );
  };

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">
            You moved {this.state.steps}{" "}
            {this.state.steps === 1 ? "time" : "times"}
          </h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">
            {this.state.message.length > 0
              ? this.state.message
              : this.state.errorMessage}
          </h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">
            LEFT
          </button>
          <button onClick={this.move} id="up">
            UP
          </button>
          <button onClick={this.move} id="right">
            RIGHT
          </button>
          <button onClick={this.move} id="down">
            DOWN
          </button>
          <button onClick={this.reset} id="reset">
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            onChange={this.onChange}
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}