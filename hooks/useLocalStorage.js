import React from "react";

function useLocalStorage(key, defaultValue) {
  const [chosenValue, setChosenValue] = React.useState(defaultValue);

  React.useEffect(() => {
    const value = localStorage.getItem(key);
    if (value) {
      setChosenValue(value);
    }
  }, []);

  return [chosenValue, setChosenValue];
}

export default useLocalStorage;
