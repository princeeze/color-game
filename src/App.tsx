import { useState, useEffect } from "react";

const COLORS = [
  "#FF5131", // Orange-red
  "#FF6142", // Lighter orange-red
  "#FF4A28", // Darker orange-red
  "#3351FF", // Blue
  "#4162FF", // Lighter blue
  "#2940FF", // Darker blue
  "#33FF51", // Green
  "#42FF60", // Lighter green
  "#28FF46", // Darker green
];

// Returns an array of 6 random colors
function getRandomColors() {
  const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
}

function App() {
  //initialize state
  const [targetColor, setTargetColor] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [status, setStatus] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const yay = new Audio("/yay.m4a");
  const laugh = new Audio("/laugh.m4a");

  // Start a new round: choose new options and a new target color
  const startNewRound = () => {
    const colorOptions = getRandomColors();
    const newTarget =
      colorOptions[Math.floor(Math.random() * colorOptions.length)];
    setTargetColor(newTarget);
    setOptions(colorOptions);
    setStatus("");
    setIsDisabled(false);
    setAnimationClass("animate-fadeIn");
  };

  // Reset game: set score and guesses to 0 and start a new round
  const resetGame = () => {
    setScore(0);
    setTotalGuesses(0);
    startNewRound();
  };

  useEffect(() => {
    startNewRound();
  }, []);

  const handleGuess = (color: string) => {
    if (isDisabled) return;
    setIsDisabled(true);
    setTotalGuesses((prev) => prev + 1);

    if (color === targetColor) {
      yay.play();
      setScore((prev) => prev + 1);
      setStatus("Correct!");
      setAnimationClass("animate-scaleUp border-green-500");
    } else {
      laugh.play();
      setStatus("Wrong!");
      setAnimationClass("animate-shake border-red-500");
    }

    setTimeout(() => {
      startNewRound();
    }, 3000);
  };

  return (
    <div className="flex relative flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4" data-testid="gameInstructions">
        Guess the correct color!
      </h1>

      {/* Target Color Box */}
      <div
        className={`w-32 h-32 rounded-lg border-4 shadow-lg mb-6 transition-all duration-300 ${animationClass}`}
        style={{ backgroundColor: targetColor }}
        data-testid="colorBox"
      ></div>

      {/* Color Options */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {options.map((color, index) => (
          <button
            key={index}
            className="w-20 h-20 rounded-md shadow-md transition-transform transform hover:scale-105"
            style={{ backgroundColor: color }}
            onClick={() => handleGuess(color)}
            disabled={isDisabled}
            data-testid="colorOption"
          ></button>
        ))}
      </div>

      {/* Game Status */}
      <p className="text-lg mb-2" data-testid="gameStatus">
        {status}
      </p>

      {/* Score and Total Guesses */}
      <p className="text-lg">
        Score: <span data-testid="score">{score}</span> / Total:{" "}
        <span>{totalGuesses}</span>
      </p>

      {status === "Correct!" && (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50 ">
          <div
            className={`w-32 flex items-center justify-center animate-scale`}
          >
            <img
              src="/correct.png"
              alt="Correct!"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {status === "Wrong!" && (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50 `}">
          <div className={`w-32 flex items-center justify-center `}>
            <video
              src="/wrong.webm"
              autoPlay
              loop
              muted
              className="w-full animate-scale h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Reset Game Button */}
      <button
        onClick={resetGame}
        className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all"
        data-testid="newGameButton"
      >
        Reset Game
      </button>
    </div>
  );
}

export default App;
