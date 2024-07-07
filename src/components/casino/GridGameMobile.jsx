import { useState } from "react";

const GridGameMobile = () => {
  const [result, setResult] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState(Array(9).fill(null));

  const selectNumber = (cardIndex, number) => {
    if (number >= 1 && number <= 9) {
      setSelectedNumbers((prevNumbers) => {
        const updatedNumbers = [...prevNumbers];
        updatedNumbers[cardIndex] = number;
        return updatedNumbers;
      });
    }
  };

  const goBackToDefault = () => {
    setBetAmount("");
    setTimeout(() => {
      setSelectedNumbers(Array(9).fill(null));
      setResult(null);
    }, 3000);
  };

  const fetchGeneratedNumbers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/game/magic-number"
      );
      const array = await response.json();
      console.log("Generated numbers:", array.data);
      return array.data;
    } catch (error) {
      console.error("Error fetching generated numbers:", error);
    }
  };

  const handleInputClick = (cardIndex) => {
    const number = parseInt(prompt("Enter a number between 1 and 9"));
    selectNumber(cardIndex, number);
  };
  const notSelected = selectedNumbers.every((number) => number === null);

  const handleBet = async () => {
    setResult(null);

    if (notSelected) {
      alert("Please select at least one number to bet on!");
      setBetAmount("");
      return;
    }

    if (!betAmount) {
      alert("Please enter a bet amount");
      return;
    }

    try {
      const generatedNumbers = await fetchGeneratedNumbers();

      if (generatedNumbers.length === 0) {
        alert("Something went wrong!");
        return;
      }

      let isWinner = true;
      for (let i = 0; i < selectedNumbers.length; i++) {
        if (
          selectedNumbers[i] !== null &&
          selectedNumbers[i] !== generatedNumbers[i]
        ) {
          isWinner = false;
          break;
        }
      }

      setResult(
        isWinner
          ? `You won! Amount won: ${betAmount * 2}`
          : `You lost! Amount lost: ${betAmount}`
      );

      goBackToDefault();
    } catch (error) {
      console.error("Error in fetching numbers:", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
      <div className="flex flex-col items-center justify-center p-4">
        <span className="bg-gray-800 rounded-lg mb-4">
          <span className="px-2 py-3"> {"0.0000 ₹"} </span>
          <button className="bg-blue-500 font-semibold px-2 py-3 rounded-e-lg hover:bg-blue-600">
            Wallet
          </button>
        </span>
        <div className="bg-gray-800 rounded-lg p-4 w-full max-w-xs mb-4">
          <p className="mb-2">Enter a bet amount</p>
          <input
            type="number"
            value={betAmount}
            min={0}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="0.000"
            className="px-4 py-2 mb-2 w-full text-black"
          />
          <button
            onClick={handleBet}
            className={`px-4 py-2 w-full font-mono ${
              !betAmount ? `bg-green-700` : `bg-green-600`
            } rounded hover:bg-green-700 transition`}
            disabled={!betAmount}
          >
            Bet
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs mb-4">
          {selectedNumbers.map((number, index) => (
            <div
              key={index}
              onClick={() => {
                handleInputClick(index);
              }}
              className="hover:transition-transform hover:scale-105 bg-gray-800 hover:bg-gray-700 relative flex items-center justify-center h-16 border-2 border-gray-700 rounded cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {number}
              </div>
            </div>
          ))}
        </div>
        {result && <div className="text-xl mb-4">{result}</div>}
        <div className="bg-gray-800 rounded-lg p-4 w-full max-w-xs shadow-md">
          <h3 className="text-white text-lg font-semibold mb-4">
            Instructions
          </h3>
          <p className="text-white mb-2">
            1. Click on the cards and enter a number.
          </p>
          <p className="text-white mb-2">2. Enter a bet amount and play!</p>
          <p className="text-white mb-2">
            3. If the number you choose is generated on the same card, then you
            win based on the risk you took; otherwise, you lose.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GridGameMobile;
