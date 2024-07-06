import { useState } from "react";

const GridGame = () => {
  const [result, setResult] = useState(null);
  const [generatedNumbers, setGeneratedNumbers] = useState([]);
  const [loop, setLoop] = useState(0);
  const [betAmount, setBetAmount] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState(Array(9).fill(null));
  const [cardNumber, setCardNumber] = useState(0);

  const selectNumber = (cardIndex, number) => {
    if (number >= 1 && number <= 9) {
      setSelectedNumbers((prevNumbers) => {
        const updatedNumbers = [...prevNumbers];
        updatedNumbers[cardIndex] = number;
        return updatedNumbers;
      });
      setCardNumber(loop - 1);
    }
  };

  const goBackToDefault = () => {
    setGeneratedNumbers([]);
    setBetAmount("");
    setCardNumber(0);
    setSelectedNumbers(Array(9).fill(null));
    setResult(null);
  };

  const handleInputClick = (cardIndex) => {
    setLoop(cardNumber);
    if (loop > 0) {
      const number = parseInt(prompt("Enter a number between 1 and 9"));
      selectNumber(cardIndex, number);
    } else {
      alert("Select more cards to bet!");
    }
  };
  const notSelected = selectedNumbers.every((number) => number === null);

  const handleBet = () => {
    setResult(null);

    if (notSelected) {
      alert("Please select atleast one number to bet on!");
      setBetAmount("");
      return;
    }
    let numbers = [];
    while (numbers.length < 9) {
      const randomNumber = Math.floor(Math.random() * 9) + 1;
      if (!numbers.includes(randomNumber)) {
        numbers.push(randomNumber);
      }
    }
    setGeneratedNumbers(numbers);

    if (generatedNumbers.length != 0) {
      // for (let i = 0; i < generatedNumbers.length; i++) {
      //   if (selectedNumbers[i] === generatedNumbers[i]) {
      //     console.log("selectedNumbers[i] ", selectedNumbers[i]);
      //     console.log("generatedNumbers[i] ", generatedNumbers[i]);
      //     c = c + 1;
      //   }
      // }
      // if (c === 9) {
      //   setResult(`You won 10x of ${betAmount}`);
      // } else {
      //   setResult(`You lost ${betAmount}!`);
      // }
    } else {
      alert("Something went wrong!"); // if generatedNumbers is empty
    }
    goBackToDefault();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
      <div className="mr-10 border p-7 w-min">
        <p className="mb-2">Enter a bet amount</p>
        <input
          type="number"
          value={betAmount}
          min={0}
          onChange={(e) => setBetAmount(e.target.value)}
          placeholder="0.000"
          className="px-4 py-2 mb-2 w-full text-black"
        />

        <select
          name="number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="px-4 py-2 mb-2 text-black"
        >
          <option value={0} disabled>
            Select number of cards to play
          </option>
          {[...Array(9)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <button
          onClick={handleBet}
          className="px-4 py-2 w-full bg-green-500 rounded hover:bg-green-700 transition"
          disabled={!betAmount || betAmount <= 0}
        >
          Bet
        </button>
      </div>
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs mx-auto p-5 ">
          {selectedNumbers.map((number, index) => (
            <div
              key={index}
              onClick={() => {
                handleInputClick(index);
              }}
              className="hover:transition-transform hover:scale-105 bg-gray-800 hover:bg-gray-700 relative flex items-center justify-center w-20 h-20 border-2 border-gray-700 rounded cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {number}
              </div>
            </div>
          ))}
        </div>
        {result && <div className="m-4 text-xl ">{result}</div>}
      </div>
    </div>
  );
};

export default GridGame;
