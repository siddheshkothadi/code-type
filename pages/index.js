import Head from "next/head";
import React from "react";
import Character from "../components/Character";
import Word from "../components/Word";

export default function Home() {
  const [words, setWords] = React.useState("");
  const [typedWords, setTypedWords] = React.useState("");

  const [chosenLanguage, setChosenLanguage] = React.useState("js");
  const [toggle, setToggle] = React.useState(false);
  const [isFocussed, setIsFocussed] = React.useState(false);
  const [timer, setTimer] = React.useState(0);
  const [intervalState, setIntervalState] = React.useState(null);

  const startTimer = () => {
    setTimer(0);
    const interval = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalState);
    setIntervalState(null);
    setTimer(0);
  };

  React.useEffect(() => {
    window.document.getElementById("type-box")?.addEventListener("blur", () => {
      setIsFocussed(false);
    });
    window.document
      .getElementById("type-box")
      ?.addEventListener("focus", () => {
        setIsFocussed(true);
      });
    const res = fetch(
      `https://siddheshkothadi.github.io/APIData/language-keywords/${chosenLanguage}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        let fiftyWords = [];

        while (fiftyWords.length < 25) {
          let random = Math.floor(Math.random() * data.words.length);
          if (!fiftyWords.includes(data.words[random])) {
            fiftyWords.push(data.words[random].word);
          }
        }
        setWords(fiftyWords.join(" "));
      });

    return () => {
      // remove event listeners
    };
  }, [toggle]);

  React.useEffect(() => {
    if (typedWords.length == 1) {
      startTimer();
    } else if (typedWords.split(" ").length > 25) {
      stopTimer();
    }
  }, [typedWords]);

  React.useEffect(() => {
    console.log("focus state", isFocussed);
  }, [isFocussed]);

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-drBackground flex justify-center min-h-screen min-w-screen">
      <div className="max-w-7xl w-screen h-screen flex p-6 items-center justify-center flex-wrap flex-col">
        <p className="text-drForeGround my-2 text-lg">{timer}</p>
        <div
          className="flex flex-wrap noSelect"
          onClick={() => {
            window.document.getElementById("type-box").focus();
          }}
        >
          {words.split(" ").map((word, index) => {
            return (
              <Word
                key={index}
                actualWord={word}
                wordTyped={typedWords.split(" ")[index]}
                isLastTypedWord={index === typedWords.split(" ").length - 1}
              />
            );
          })}
        </div>
        <input
          id="type-box"
          className="bg-transparent text-transparent outline-none"
          onChange={(e) => setTypedWords(e.target.value)}
          value={typedWords}
          autoFocus
        />
        <button
          className="text-drForeGround"
          onClick={() => {
            stopTimer();
            setTypedWords("");
            setToggle(!toggle);
            window.document.getElementById("type-box").focus();
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
