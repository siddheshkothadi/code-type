import React from "react";

function useTimer(initialTime, toggle = true) {
  const [seconds, setSeconds] = React.useState(initialTime);

  React.useEffect(() => {
    let interval = null;

    if (toggle === true) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [toggle]);

  return [seconds, setSeconds];
}

export default useTimer;
