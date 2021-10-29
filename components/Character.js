import React from "react";

function Character(props) {
  const { char, color, isLastTypedCharacter, isStartOfNewWord } = props;

  return (
    <span
      className={
        "font-base text-xl sm:text-2xl xl:text-2xl inline-block " +
        (isLastTypedCharacter ? "blinkRight " : "") +
        (isStartOfNewWord ? "blinkLeft " : "")
      }
      style={{
        color: color,
        lineHeight: "1.5",
        ...(isLastTypedCharacter && {
          borderRight: `3px solid ${color}`,
          marginRight: "-3px",
        }),
        ...(isStartOfNewWord && {
          borderLeft: `3px solid ${color}`,
          marginLeft: "-3px",
        }),
      }}
    >
      {char}
    </span>
  );
}

export default Character;
