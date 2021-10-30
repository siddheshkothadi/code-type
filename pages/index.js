import Head from "next/head";
import React from "react";
import Word from "../components/Word";
import useClickOutside from "../hooks/useClickOutside";

const languages = [
  "js",
  "jsx",
  "html",
  "css",
  "java",
  "py",
  "lua",
  "php",
  "rb",
  "cpp",
  "pl",
  "cs",
  "scala",
  "go",
  "sql",
  "rs",
  "lisp",
  "clj",
  "kt",
  "cmake",
  "swift",
  "hs",
  "ex",
  "objc",
  "fs",
  "elm",
  "purs",
  "pas",
  "r",
  "erl",
  "vim",
  "groovy",
];

export default function Home() {
  const [words, setWords] = React.useState("");
  const [typedWords, setTypedWords] = React.useState("");

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const [chosenLanguage, setChosenLanguage] = React.useState("js");

  // const [chosenFont, setChosenFont] = React.useState("monospace");

  const [toggle, setToggle] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [typingStarted, setTypingStarted] = React.useState(false);

  const [prevAccuracy, setPrevAccuracy] = React.useState(null);
  const [prevWPM, setPrevWPM] = React.useState(null);

  const dropdownRef = React.useRef(null);

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
  }, [toggle, chosenLanguage]);

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

  useClickOutside(dropdownRef, function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  });

  if (words.length === 0) {
    return (
      <div className="bgColor flex justify-center items-center min-h-screen min-w-screen">
        <div className="text-drForeGround my-2 text-lg">Loading</div>
      </div>
    );
  }

  return (
    <div className="bgColor flex justify-center min-h-screen min-w-screen overflow-scroll md:overflow-hidden">
      <Head></Head>
      <div className="max-w-7xl w-screen h-screen flex p-6 items-center justify-around flex-col">
        <div className="flex md:flex-row justify-between items-center w-full flex-wrap max-w-5xl px-4">
          {/* <p className=" text-adSubColor my-1 text-sm md:text-lg">{seconds}</p> */}
          <p className="text-adSubColor my-1 mb-4 text-sm md:text-lg">
            {`${typedWords.split(" ").length - 1}/${words.split(" ").length}`}
          </p>
          <div className="relative text-adMainColor text-lg cursor-pointer font-bold">
            <p onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {chosenLanguage}
            </p>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-8 bg-drComment rounded-md overflow-y-scroll h-40 containerWithoutScrollbar"
                style={{
                  right: "-17px",
                  boxSizing:
                    "content-box" /* So the width will be 100% + 17px */,
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
          className="flex flex-wrap noSelect sm:px-4 max-w-5xl"
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
              setToggle(!toggle);
              window.document.getElementById("type-box").focus();
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
