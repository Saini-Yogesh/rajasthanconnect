import React from "react";
import { Sparkles, HelpCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react";

const TRIVIA_FACTS = [
  "Jaipur was painted pink in 1876 to welcome Prince Albert. The city has kept this colour for 150+ years!",
  "Bhangarh Fort is India's only legally haunted place — the ASI bans entry after sunset by law.",
  "Jaisalmer Fort is one of the world's only 'living forts' — 3,000 people still live inside its 12th-century walls!",
  "Mehrangarh Fort walls still bear visible cannonball scars from battles fought over 500 years ago.",
  "Udaipur's Lake Palace appears to float on water — it was built entirely of white marble in 1743 AD.",
];

export default function TriviaQuiz({
  activeTrivia,
  setActiveTrivia,
  setIsTriviaHovered,
  quizAnswered,
  handleQuizAnswer,
  resetQuiz,
}) {
  return (
    <div className="hubColumn">
      <div
        className="hubCard triviaCard"
        onMouseEnter={() => setIsTriviaHovered(true)}
        onMouseLeave={() => setIsTriviaHovered(false)}
      >
        <div className="cardHeader">
          <Sparkles className="headerIcon gold" />
          <h3>Did You Know?</h3>
          <span className="factCounter">
            Fact {activeTrivia + 1} of {TRIVIA_FACTS.length}
          </span>
        </div>
        <div className="triviaContentBox">
          <p className="triviaText">"{TRIVIA_FACTS[activeTrivia]}"</p>
        </div>
        <div className="triviaControls">
          {TRIVIA_FACTS.map((_, idx) => (
            <button
              key={idx}
              className={`triviaDot ${idx === activeTrivia ? "active" : ""}`}
              onClick={() => setActiveTrivia(idx)}
              aria-label={`Show fact ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="hubCard quizCard">
        <div className="cardHeader">
          <HelpCircle className="headerIcon" />
          <h3>Royal Quiz of the Day</h3>
        </div>
        <div className="quizContent">
          <p className="quizQuestion">
            Which Rajput king built the astronomical observatories (Jantar
            Mantar) in Jaipur and Delhi?
          </p>
          {quizAnswered === null ? (
            <div className="quizOptionsList">
              <button
                onClick={() => handleQuizAnswer(0)}
                className="btnQuizOption"
              >
                A) Maharana Pratap
              </button>
              <button
                onClick={() => handleQuizAnswer(1)}
                className="btnQuizOption"
              >
                B) Rao Jodha
              </button>
              <button
                onClick={() => handleQuizAnswer(2)}
                className="btnQuizOption"
              >
                C) Maharaja Sawai Jai Singh II
              </button>
              <button
                onClick={() => handleQuizAnswer(3)}
                className="btnQuizOption"
              >
                D) Rawal Jaisal
              </button>
            </div>
          ) : (
            <div className="quizResult">
              {quizAnswered === "correct" ? (
                <div className="resultBox correct">
                  <CheckCircle size={28} className="resultIcon" />
                  <h4>Khamma Ghani! Correct!</h4>
                  <p>
                    Maharaja Sawai Jai Singh II founded Jaipur in 1727 and
                    built 5 observatories across India.
                  </p>
                </div>
              ) : (
                <div className="resultBox incorrect">
                  <XCircle size={28} className="resultIcon" />
                  <h4>Incorrect — Try Again!</h4>
                  <p>
                    Hint: He founded the Pink City of Jaipur in 1727 and
                    was an astronomer-king.
                  </p>
                </div>
              )}
              <button onClick={resetQuiz} className="btnQuizReset">
                <RefreshCw size={14} /> Reset Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { TRIVIA_FACTS };
