import React from "react";

function Character(props) {
  const { char, color, isLastTypedCharacter, isStartOfNewWord } = props;

  return (
    <span
      className={
        "font-bold text-2xl sm:text-3xl md:text-4xl " +
        (isLastTypedCharacter ? "blinkRight " : "") +
        (isStartOfNewWord ? "blinkLeft " : "")
      }
      style={{
        color: color,
        ...(isLastTypedCharacter && {
          borderRight: `2px solid ${color}`,
          marginRight: "-2px",
        }),
        ...(isStartOfNewWord && {
          borderLeft: `2px solid ${color}`,
          marginLeft: "-2px",
        }),
      }}
    >
      {char}
    </span>
  );
}

export default Character;
