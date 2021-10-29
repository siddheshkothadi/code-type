import Head from "next/head";
import React from "react";
import Word from "../components/Word";

export default function Home() {
  const [words, setWords] = React.useState("");
  const [typedWords, setTypedWords] = React.useState("");

  const [chosenLanguage, setChosenLanguage] = React.useState("js");
  const [toggle, setToggle] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [typingStarted, setTypingStarted] = React.useState(false);

  const [prevAccuracy, setPrevAccuracy] = React.useState(null);
  const [prevWPM, setPrevWPM] = React.useState(null);

  const calculateWPM = () => {
    const wordsPerMinute = words.split(" ").length / (seconds / 60);
    return wordsPerMinute;
  };

  const calculateAccuracy = (typedSentence) => {
    const typedWordsArray = typedSentence.split(" ");
    const wordsArray = words.split(" ");
    let correctCharacters = 0;
    let totalCharacters = 0;
    wordsArray.forEach((word, index) => {
      const charactersInTypedWords = typedWordsArray[index].split("");
      const charactersInWords = word.split("");
      charactersInWords.forEach((character, index) => {
        totalCharacters++;
        if (charactersInTypedWords[index] === character) {
          correctCharacters++;
        }
      });
    });
    const accuracy = correctCharacters / totalCharacters;
    return accuracy;
  };

  const typingFinished = (typedSentence) => {
    // calculate accuracy
    const accuracy = calculateAccuracy(typedSentence);
    // calculate wpm
    const wpm = calculateWPM();
    console.log(accuracy, wpm);
    setPrevAccuracy(accuracy.toFixed(2));
    setPrevWPM(wpm.toFixed(2));
    // set state
    setTypingStarted(false);
    setSeconds(0);
    setTypedWords("");
    setToggle(!toggle);
    window.document.getElementById("type-box").focus();
  };

  React.useEffect(() => {
    fetch(
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
    let interval = null;

    if (typingStarted === true) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [typingStarted]);

  if (words.length === 0) {
    return (
      <div className="bg-drBackground flex justify-center items-center min-h-screen min-w-screen">
        <div className="text-drForeGround my-2 text-lg">Loading</div>
      </div>
    );
  }

  return (
    <div className="bg-drBackground flex justify-center min-h-screen min-w-screen overflow-scroll md:overflow-hidden">
      <Head></Head>
      <div className="max-w-7xl w-screen h-screen flex p-6 items-center justify-around flex-col">
        <div className="flex flex-col justify-around items-center w-full">
          <p className="text-drPink my-1 text-2xl">{seconds}</p>
          <p className="text-drPurple my-1 mb-4 text-2xl">
            {`${typedWords.split(" ").length - 1}/${words.split(" ").length}`}
          </p>
        </div>
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
          className="bg-transparent text-transparent outline-none fixed"
          style={{
            top: "-100px",
          }}
          onChange={(e) => {
            if (typingStarted === false && e.target.value.length > 0) {
              setTypingStarted(true);
            }
            setTypedWords(e.target.value);
            if (
              e.target.value.split(" ").length > words.split(" ").length ||
              (e.target.value.split(" ").length === words.split(" ").length &&
                e.target.value.split(" ")[e.target.value.split(" ").length - 1]
                  .length ===
                  words.split(" ")[words.split(" ").length - 1].length)
            ) {
              typingFinished(e.target.value);
            }
          }}
          value={typedWords}
          autoFocus
        />
        <div className="flex items-center justify-around w-full">
          {prevAccuracy !== null && (
            <p className="text-drGreen my-1 text-lg">
              {`Accuracy: ${prevAccuracy * 100}%`}
            </p>
          )}
          <button
            className="text-drYellow text-xl hover:bg-black p-4 rounded-xl"
            onClick={() => {
              setTypedWords("");
              setToggle(!toggle);
              window.document.getElementById("type-box").focus();
            }}
          >
            Refresh
          </button>
          {prevWPM !== null && (
            <p className="text-drOrange my-1 text-lg">{`WPM: ${prevWPM}`}</p>
          )}
        </div>
      </div>
    </div>
  );
}
