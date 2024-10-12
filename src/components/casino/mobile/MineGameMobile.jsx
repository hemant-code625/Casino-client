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
import WalletPopup from "../../WalletPopup.jsx";
import { toast } from "react-toastify";

const MineGameMobile = () => {
  const [betAmount, setBetAmount] = useState(null);
  const [mineCount, setMineCount] = useState(3);
  const [gameId, setGameId] = useState(null);

  const [isGameOver, setIsGameOver] = useState(false);
  const [grid, setGrid] = useState(Array(25).fill(null));
  const [opacity, setOpacity] = useState(false);
  const [tilesClicked, setTilesClicked] = useState(false);
  const [multiplier, setMultiplier] = useState(0);
  const [winningAmount, setWinningAmount] = useState(null);

  const [startGame] = useMutation(START_GAME);
  const [selectTile] = useMutation(SELECT_TILE);
  const [toggleWallet, setToggleWallet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState([]);

  const toggleWalletPopup = () => {
    setToggleWallet(!toggleWallet);
  };

  const { refetch } = useQuery(GET_GAME_RESULTS, {
    variables: { gameId },
    skip: !gameId,
  });

  const [cashoutResult] = useMutation(CASHOUT_RESULT);

  const handleBet = async () => {
    setIsGameOver(false);
    setMultiplier(0);
    setWinningAmount(0);
    setOpacity(false);
    setGrid(Array(25).fill(null));
    setTilesClicked(false);
    setSelectedTiles([]);

    if (!betAmount || betAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (mineCount === "") {
      toast.error("Please select number of mines to play with to continue");
      return;
    }
    setLoading(true);
    try {
      const { data } = await startGame({
        variables: {
          betAmount: parseFloat(betAmount),
          mineCount: parseInt(mineCount),
        },
      });
      setLoading(false);
      playButtonClickedAudio();
      setGameId(data.startGame.gameId);
    } catch (error) {
      setLoading(false);
      console.error("Error starting game:", error);
    }
  };

  const playButtonClickedAudio = () => {
    const audio = new Audio(buttonClickedAudio);
    audio.play();
  };

  const handleTileClick = async (position) => {
    if (!gameId) {
      toast.error("Please place a bet to start the game");
      return;
    }
    if (isGameOver) return;
    setTilesClicked(true);

    try {
      const { data } = await selectTile({
        variables: { gameId, position },
      });
      const isMine = data.selectTile.isMine;
      setMultiplier(data.selectTile.multiplier);
      setWinningAmount(data.selectTile.winningAmount);

      // Using functional setState to ensure you're updating based on the latest state
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[position] = isMine ? mine : gem;
        if (isMine) {
          setSelectedTiles(newGrid);
        }
        return newGrid;
      });

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
    setSelectedTiles(grid);

    try {
      const { data } = await cashoutResult({
        variables: { gameId },
      });
      setGrid(
        data.cashoutResult.mineField.map((cell) => (cell === "M" ? mine : gem))
      );
      setMineCount(data.cashoutResult.mineCount);
      setBetAmount(data.cashoutResult.betAmount);
      setMultiplier(data.cashoutResult.multiplier);
      setWinningAmount(data.cashoutResult.winningAmount);
      toast.success("Cashout successfully");
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
    <div className="select-none bg-gradient-to-br bg-gray-900 text-white min-h-screen">
      <h1 className="text-center text-3xl pt-4 font-bold">Mine Game</h1>
      <div className="flex flex-col items-center justify-center p-8">
        <span className="bg-gray-800 rounded-lg">
          <span className="px-2 py-3"> {"0.0000 ₹"} </span>
          <button
            onClick={() => toggleWalletPopup()}
            className="bg-blue-500 font-semibold px-2 py-3 rounded-e-lg hover:bg-blue-600"
          >
            {" "}
            Wallet{" "}
          </button>
        </span>
      </div>
      {toggleWallet && (
        <WalletPopup
          isOpen={toggleWallet}
          onClose={() => setToggleWallet(false)}
        />
      )}
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-5 gap-4 w-full max-w-lg p-5 mt-2">
          {grid.map((cell, index) => (
            <div
              key={index}
              onClick={() => handleTileClick(index)}
              className="hover:transition-transform hover:scale-105 bg-gray-800 hover:bg-gray-700 relative flex items-center justify-center w-16 h-16 border-2 border-gray-700 rounded cursor-pointer"
            >
              <div
                className={`${
                  selectedTiles[index] ? "border-2 bg-gray-500 rounded-lg" : ""
                } ${
                  opacity ? "opacity-65" : ""
                } absolute inset-0 flex items-center justify-center`}
              >
                {cell && <img src={cell} alt="" />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-4 w-full max-w-lg">
          <p className="mb-2">Enter a bet amount</p>
          <input
            type="number"
            value={betAmount}
            min={0}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="0.000"
            className="px-4 py-2 mb-2 w-full text-white bg-gray-700 rounded-lg"
          />
          <select
            name="number"
            id="number"
            value={mineCount}
            onChange={(e) => setMineCount(e.target.value)}
            className="px-4 py-2 mb-2 text-white bg-gray-700 rounded-lg"
          >
            <option value="" disabled>
              Select Mines
            </option>
            {[...Array(24)].map((_, i) => (
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
              } rounded-lg hover:bg-green-700 transition cursor-pointer`}
              disabled={!tilesClicked || isGameOver}
            >
              Cashout
            </button>
          ) : (
            <button
              onClick={handleBet}
              className={`mt-2 px-4 py-3 w-full font-mono ${
                !betAmount ? "bg-green-700" : "bg-green-600"
              } rounded-lg hover:bg-green-700 transition cursor-pointer`}
            >
              {loading ? (
                <>
                  {" "}
                  <div>
                    <svg
                      aria-hidden="true"
                      className="inline w-6 h-6 animate-spin text-white fill-blue-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>{" "}
                </>
              ) : (
                "Bet"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MineGameMobile;
