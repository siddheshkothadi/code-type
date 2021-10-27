import Head from "next/head";
import React from "react";
import Character from "../components/Character";
import Word from "../components/Word";

export default function Home() {
  const [words, setWords] = React.useState("");
  const [typedWords, setTypedWords] = React.useState("");

  React.useEffect(() => {
    const res = fetch(
      "https://siddheshkothadi.github.io/APIData/language-keywords/js.json"
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

        // set top 25 words
        // setWords(
        //   data.words
        //     .slice(0, 25)
        //     .map((word) => word.word)
        //     .join(" ")
        // );
      });
  }, []);

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-drBackground flex justify-center min-h-screen min-w-screen">
      <div className="max-w-7xl w-screen h-screen flex p-6 items-center justify-center">
        <div className="flex flex-wrap">
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
          type="text"
          onChange={(e) => setTypedWords(e.target.value)}
          value={typedWords}
          autoFocus
        />
      </div>
    </div>
  );
}
