import Head from "next/head";
import React from "react";
import Word from "../components/Word";
import useClickOutside from "../hooks/useClickOutside";
import useLocalStorage from "../hooks/useLocalStorage";
import useTimer from "../hooks/useTimer";
import { languages, wordLengths } from "../staticData";

export default function Home() {
  const [wordLength, setWordLength] = React.useState(10);
  const [words, setWords] = React.useState("");
  const [typedWords, setTypedWords] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [chosenLanguage, setChosenLanguage] = useLocalStorage("language", "js");
  const [toggle, setToggle] = React.useState(false);
  const [typingStarted, setTypingStarted] = React.useState(false);
  const [seconds, setSeconds] = useTimer(0, typingStarted);
  const [prevAccuracy, setPrevAccuracy] = useLocalStorage("accuracy", null);
  const [prevWPM, setPrevWPM] = useLocalStorage("wpm", null);
  const [isInputFocused, setIsInputFocused] = React.useState(true);

  const dropdownRef = React.useRef(null);
  useClickOutside(dropdownRef, function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  });

  const typingAreaRef = React.useRef(null);
  useClickOutside(typingAreaRef, function handleClickOutside(event) {
    if (
      typingAreaRef.current &&
      !typingAreaRef.current.contains(event.target)
    ) {
      setIsInputFocused(false);
    }
  });

  const calculateWPM = () => {
    const wordsPerMinute =
      (typedWords.split(" ").filter((word) => {
        return word.length > 0;
      }).length /
        seconds) *
      60;
    return wordsPerMinute.toFixed(2);
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
      if (charactersInTypedWords.length > charactersInWords.length) {
        totalCharacters +=
          charactersInTypedWords.length - charactersInWords.length;
      }
    });
    const accuracy = correctCharacters / totalCharacters;
    return accuracy.toFixed(2);
  };

  const typingFinished = (typedSentence) => {
    const accuracy = calculateAccuracy(typedSentence);
    const wpm = calculateWPM();
    localStorage.setItem("accuracy", accuracy);
    localStorage.setItem("wpm", wpm);
    setPrevAccuracy(accuracy);
    setPrevWPM(wpm);
    setTypingStarted(false);
    setSeconds(0);
    setTypedWords("");
    setToggle(!toggle);
  };

  React.useEffect(() => {
    localStorage.setItem("language", chosenLanguage);
    fetch(
      `https://siddheshkothadi.github.io/APIData/language-keywords/${chosenLanguage}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        let selectedWords = [];

        while (selectedWords.length < wordLength) {
          let random = Math.floor(Math.random() * data.words.length);
          if (!selectedWords.includes(data.words[random])) {
            selectedWords.push(data.words[random].word);
          }
        }
        setWords(selectedWords.join(" "));
        window.document.getElementById("type-box").focus();
        setIsInputFocused(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [toggle, chosenLanguage, wordLength]);

  if (words.length === 0) {
    return (
      <div className="bgColor flex justify-center items-center min-h-screen min-w-screen">
        <div className="text-drForeGround my-2 text-lg">Loading</div>
      </div>
    );
  }

  return (
    <div className="bgColor flex justify-center min-h-screen min-w-screen overflow-scroll md:overflow-hidden">
      <Head>
        <title>CodeType</title>
        <meta property="og:title" content="CodeType" key="title" />
        <meta
          name="description"
          content="Typing practice for programmers. Practice code-typing with top 1000 keywords of the most popular programming languages."
        />
        <meta
          property="og:description"
          content="Typing practice for programmers
          Practice code-typing with top 1000 keywords of the most popular programming languages."
          key="description"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <link rel="icon" href="/CodeType.png" />
      </Head>
      <div className="max-w-7xl w-screen h-screen flex p-6 items-center justify-around flex-col">
        <div className="flex md:flex-row justify-between items-center w-full flex-wrap max-w-5xl px-4">
          <div className="flex flex-col">
            <div className="flex-row inline-flex">
              <p className="text-adSubColor my-1 mb-4 text-sm md:text-lg">
                {`${typedWords.split(" ").length - 1}/${
                  words.split(" ").length
                }`}
              </p>
              <p className=" text-adMainColor my-1 text-sm md:text-lg ml-8">
                {seconds}
              </p>
            </div>
            <div className="flex-row hidden sm:inline-flex">
              {wordLengths.map((length, index) => (
                <div
                  className={`${
                    length === wordLength
                      ? "text-adMainColor"
                      : "text-adSubColor"
                  } 
                text-sm md:text-lg mx-2 ${
                  index == 0 ? "ml-0" : ""
                } my-1 cursor-pointer`}
                  onClick={() => setWordLength(length)}
                  key={length}
                >
                  {length}
                </div>
              ))}
            </div>
          </div>
          <div className="relative text-adMainColor text-lg cursor-pointer font-bold z-40">
            <p onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {chosenLanguage}
            </p>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-8 bg-drComment rounded-md overflow-y-scroll h-40 containerWithoutScrollbar"
                style={{
                  right: "-17px",
                  boxSizing: "content-box",
                }}
              >
                {languages.map((language) => (
                  <p
                    key={language}
                    className={`text-adMainColor text-sm cursor-pointer font-bold hover:bg-adBgColor px-8 ${
                      chosenLanguage === language
                        ? "text-drForeGround"
                        : "text-adSubColor"
                    }`}
                    onClick={() => {
                      setWords("");
                      setTypedWords("");
                      setChosenLanguage(language);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {language}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        <div
          ref={typingAreaRef}
          className="flex relative flex-wrap noSelect px-4 sm:px-4 max-w-5xl py-6"
          onClick={() => {
            window.document.getElementById("type-box").focus();
            setIsInputFocused(true);
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
          {!isInputFocused && (
            <div className="absolute left-0 top-0 right-0 bottom-0 flex justify-center items-center bg-opacity-95 cursor-pointer noSelect p-10 backdrop-filter backdrop-blur">
              <p className="text-adMainColor text-lg font-bold my-10">
                Click or tap to focus
              </p>
            </div>
          )}
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
        <div className="flex items-center justify-evenly w-full flex-col sm:flex-row  max-w-5xl">
          {prevAccuracy !== null && (
            <p className="text-adSubColor my-1 text-sm md:text-lg font-bold">
              {`acc: ${prevAccuracy * 100}%`}
            </p>
          )}
          <button
            className="text-adMainColor font-bold text-sm md:text-lg hover:bg-adSubColor focus:bg-adSubColor hover:text-adBgColor focus:text-adBgColor outline-none px-3 py-2 rounded-xl"
            onClick={() => {
              setTypedWords("");
              setSeconds(0);
              setTypingStarted(false);
              setToggle(!toggle);
            }}
          >
            Refresh
          </button>
          {prevWPM !== null && (
            <p className="text-adSubColor my-1 text-sm md:text-lg font-bold">{`wpm: ${prevWPM}`}</p>
          )}
        </div>
      </div>
    </div>
  );
}
