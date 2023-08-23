import React from "react";
import { useState } from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at
const initialWinMessage = "";

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);
  const [winMessage, setWinMessage] = useState(initialWinMessage);
  const [errorMessage, setErrorMessage] = useState("");

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let x = (index % 3) + 1;
    let y = Math.floor(index / 3) + 1;

    return [x, y];
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coordinates = getXY();

    return `Coordinates (${coordinates})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let coordinates = getXY();
    let currentIndex = index;
    let newIndex = index;
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
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    evt.preventDefault();
    let direction = evt.target.id;
    let newIndex = getNextIndex(direction);
    let coordinates = getXYMessage();
    let currentSteps = index !== newIndex ? steps + 1 : steps;
    if (index === newIndex) {
      let directionMessage = `You can't go ${direction}`;
      setMessage(directionMessage);
    }
    setIndex(newIndex);
    setSteps(currentSteps);
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    const value = evt.target.value;
    setEmail(value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const coordinates = getXY();
    let payload = {
      x: coordinates[0],
      y: coordinates[1],
      steps: steps,
      email: email,
    };

    axios
      .post("http://localhost:9000/api/result", payload)
      .then((res) => {
        setWinMessage(res.data.message);
        setEmail(initialEmail);
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 data-testid="coordinates" id="coordinates">
          {getXYMessage()}
        </h3>
        <h3 data-testid="steps" id="steps">
          You moved {steps} {steps === 1 ? "time" : "times"}
        </h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">
          {message}
          {winMessage.length > 0 ? winMessage : errorMessage}
        </h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">
          LEFT
        </button>
        <button onClick={move} id="up">
          UP
        </button>
        <button onClick={move} id="right">
          RIGHT
        </button>
        <button onClick={move} id="down">
          DOWN
        </button>
        <button onClick={reset} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          id="email"
          type="email"
          placeholder="type email"
          value={email}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}