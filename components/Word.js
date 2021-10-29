import React from "react";
import Character from "./Character";

function getColor(index, wordTyped, actualWord) {
  if (index < wordTyped.length && index < actualWord.length) {
    if (wordTyped[index] === actualWord[index]) {
      return "#fca6d1";
    }
  } else if (index < actualWord.length && index >= wordTyped.length) {
    return "#99d6ea";
  }
  return "#fffb85";
}

function Word(props) {
  const { wordTyped, actualWord, isLastTypedWord } = props;

  if (wordTyped === undefined) {
    return (
      <div className="mr-2">
        {actualWord.split("").map((char, index) => {
          return <Character key={index} char={char} color={"#99d6ea"} />;
        })}
      </div>
    );
  }

  return (
    <div className="mr-2">
      {actualWord.split("").map((char, index) => {
        return (
          <Character
            key={index}
            char={char}
            color={getColor(index, wordTyped, actualWord)}
            isLastTypedCharacter={
              isLastTypedWord && index === wordTyped.length - 1
            }
            isStartOfNewWord={
              isLastTypedWord && wordTyped.length === 0 && index === 0
            }
          />
        );
      })}
      {wordTyped.length > actualWord.length &&
        wordTyped.split("").map((char, index) => {
          if (index >= actualWord.length) {
            return (
              <Character
                key={index}
                char={char}
                color={getColor(index, wordTyped, actualWord)}
                isLastTypedCharacter={
                  isLastTypedWord && index === wordTyped.length - 1
                }
              />
            );
          }
        })}
    </div>
  );
}

export default Word;
