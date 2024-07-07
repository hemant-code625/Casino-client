import { useState } from "react";

const MineGame = () => {
  const [result, setResult] = useState("");
  const [betAmount, setBetAmount] = useState("");
  //   const [selectMines, setSelectMines] = useState(3);

  //   M (multipliers) = 1.09 , 1.19 ,

  const handleBet = async () => {
    setResult(null);

    if (!betAmount) {
      alert("Please enter a bet amount");
      return;
    }
    // Send user data to the server and get back the result
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
      <h1 className="text-center text-xl pt-4">Mine Game</h1>
      <div className="flex flex-col items-center justify-center p-8">
        <span className="bg-gray-800 rounded-lg">
          <span className="px-2 py-3"> {"0.0000 ₹"} </span>
          <button className="bg-blue-500 font-semibold px-2 py-3 rounded-e-lg hover:bg-blue-600">
            {" "}
            Wallet{" "}
          </button>
        </span>
      </div>
      <div className="flex justify-center items-center">
        <div className="mr-10 bg-gray-800 rounded-lg p-7 ">
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
            }  rounded hover:bg-green-700 transition`}
            disabled={!betAmount}
          >
            Bet
          </button>
        </div>
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs mx-auto p-5 ">
            {Array(9).map((number, index) => (
              <div
                key={index}
                onClick={() => {
                  console.log(" Card clicked");
                }}
                className="hover:transition-transform hover:scale-105 bg-gray-800 hover:bg-gray-700 relative flex items-center justify-center w-20 h-20 border-2 border-gray-700 rounded cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {number}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center text-2xl">
        {result && <div className="m-4 text-xl ">{result}</div>}
      </div>
      <div className="flex items-center justify-around mt-10">
        <div className="max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-white text-lg font-semibold mb-4">
            Instructions
          </h3>
          <p className="text-white mb-2">
            1. Click on the cards and enter a number.
          </p>
          <p className="text-white mb-2">2. Enter a bet amount and play!</p>
          <p className="text-white mb-2">
            3. If the number you choose is generated on the same card, then you
            win based on the risk you took otherwise, you lose.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MineGame;
