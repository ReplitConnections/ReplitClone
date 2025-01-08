import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  const counterButtonStyle = {
    color: "white",
    backgroundColor: "#121b2b",
    padding: "0.5em",
    borderColor: "white",
    borderWidth: "0.1em",
    borderRadius: "0.25em",
    margin: "0 0.5em"
  };

  return (
    <button style={counterButtonStyle} onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}