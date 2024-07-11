import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  START_GAME,
  SELECT_TILE,
  GET_GAME_RESULTS,
  CASHOUT_RESULT,
} from "../../../utility/Querries.js";
import mine from "../../../assets/mine.svg";
import gem from "../../../assets/gem.svg";
// import mineEffect from "../../../assets/mineEffect.gif";
import gemAudio from "../../../assets/gem.mp3";
import mineAudio from "../../../assets/mine.mp3";
import buttonClickedAudio from "../../../assets/buttonClicked.mp3";

const MineGameDesktop = () => {
  const [betAmount, setBetAmount] = useState("");
  const [mineCount, setMineCount] = useState(3);
  const [gameId, setGameId] = useState(null);
  const [multiplier, setMultiplier] = useState(0);
  const [winningAmount, setWinningAmount] = useState(null);

  const [isGameOver, setIsGameOver] = useState(false);
  const [grid, setGrid] = useState(Array(25).fill(null));
  const [opacity, setOpacity] = useState(false);
  const [tilesClicked, setTilesClicked] = useState(false);

  const [startGame] = useMutation(START_GAME);
  const [selectTile] = useMutation(SELECT_TILE);

  const { refetch } = useQuery(GET_GAME_RESULTS, {
    variables: { gameId },
    skip: !gameId,
  });
  const [cashoutResult] = useMutation(CASHOUT_RESULT);

  const handleBet = async () => {
    playButtonClickedAudio();
    setIsGameOver(false);
    setMultiplier(0);
    setWinningAmount(0);
    setOpacity(false);
    setGrid(Array(25).fill(null));
    setTilesClicked(false);

    if (!betAmount) {
      alert("Please enter a bet amount");
      return;
    }
    try {
      const { data } = await startGame({
        variables: {
          betAmount: parseFloat(betAmount),
          mineCount: parseInt(mineCount),
        },
      });
      setGameId(data.startGame.gameId);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };
  const playButtonClickedAudio = () => {
    const audio = new Audio(buttonClickedAudio);
    audio.play();
  };

  const handleTileClick = async (position) => {
    if (isGameOver) return;
    setTilesClicked(true);

    try {
      const { data } = await selectTile({
        variables: { gameId, position },
      });
      const isMine = data.selectTile.isMine;
      setMultiplier(data.selectTile.multiplier);
      setWinningAmount(data.selectTile.winningAmount);
      const newGrid = [...grid];

      newGrid[position] = isMine ? mine : gem;
      setGrid(newGrid);

      const audio = new Audio(isMine ? mineAudio : gemAudio);
      audio.play();

      if (isMine) {
        setIsGameOver(true);
        showResult();
      }
    } catch (error) {
      console.error("Error selecting tile:", error);
    }
  };

  const handleCashout = async () => {
    playButtonClickedAudio();
    setIsGameOver(true);
    setOpacity(true);

    try {
      const { data } = await cashoutResult({
        variables: { gameId },
      });
      console.log("data.cashoutResult ", data.cashoutResult);
      setGrid(
        data.cashoutResult.mineField.map((cell) => (cell === "M" ? mine : gem))
      );
      setMineCount(data.cashoutResult.mineCount);
      setBetAmount(data.cashoutResult.betAmount);
      setMultiplier(data.cashoutResult.multiplier);
      setWinningAmount(data.cashoutResult.winningAmount);
    } catch (error) {
      console.error("Error cashing out:", error);
    }
  };

  const showResult = async () => {
    const { data } = await refetch();
    setOpacity(true);
    setGrid(
      data.getGameResults.mineField.map((cell) => (cell === "M" ? mine : gem))
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
      <h1 className="text-center text-3xl pt-4 font-bold">Mine Game</h1>
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
          <select
            name="number"
            id="number"
            value={mineCount}
            onChange={(e) => setMineCount(e.target.value)}
            className="px-4 py-2 mb-2 text-black"
          >
            <option value="" disabled>
              Select Mines
            </option>
            {[...Array(9)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <div className="ml-3">Multiplier: {multiplier} x </div>
          <div className="ml-3">Winning Amount: {winningAmount}</div>
          {gameId && !isGameOver ? (
            <button
              onClick={handleCashout}
              className={`mt-2 px-4 py-2 w-full font-mono ${
                !tilesClicked || isGameOver ? "bg-green-700" : "bg-green-600"
              } rounded hover:bg-green-700 transition cursor-pointer`}
              disabled={!tilesClicked || isGameOver}
            >
              Cashout
            </button>
          ) : (
            <button
              onClick={handleBet}
              className={`mt-2 px-4 py-2 w-full font-mono ${
                !betAmount ? "bg-green-700" : "bg-green-600"
              } rounded hover:bg-green-700 transition cursor-pointer`}
              disabled={!betAmount || !mineCount}
            >
              Bet
            </button>
          )}
        </div>
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-5 gap-4 w-full mx-auto p-5">
            {grid.map((cell, index) => (
              <div
                key={index}
                onClick={() => handleTileClick(index)}
                className="hover:transition-transform hover:scale-105 bg-gray-800 hover:bg-gray-700 relative flex items-center justify-center w-20 h-20 border-2 border-gray-700 rounded cursor-pointer"
              >
                <div
                  className={`${
                    opacity ? "opacity-65" : ""
                  } absolute inset-0 flex items-center justify-center`}
                >
                  {cell && <img src={cell} alt="" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MineGameDesktop;
