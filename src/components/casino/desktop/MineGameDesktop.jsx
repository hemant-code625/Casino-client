import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import {
  START_GAME,
  SELECT_TILE,
  GET_GAME_RESULTS,
  CASHOUT_RESULT,
} from "../../../utility/Querries.js";
import mine from "../../../assets/mine.svg";
import gem from "../../../assets/gem.svg";
import gemAudio from "../../../assets/gem.mp3";
import mineAudio from "../../../assets/mine.mp3";
import buttonClickedAudio from "../../../assets/buttonClicked.mp3";
import WalletPopup from "../../WalletPopup.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const MineGameDesktop = () => {
  const [betAmount, setBetAmount] = useState(0);
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
  const [toggleWallet, setToggleWallet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [wallet, setWallet] = useState(0);

  const navigate = useNavigate();
  const token = Cookies.get("accessToken");
  const { username } = jwtDecode(token);
  const url = import.meta.env.VITE_API_URL;

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
    if (betAmount > wallet) {
      toast.error("Insufficient funds in wallet");
      return;
    }
    // TODO: Deduct the bet amount from the wallet in the database too
    setWallet(wallet - betAmount);
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

    if (isGameOver || grid[position] !== null) return;

    setTilesClicked(true);

    try {
      const { data } = await selectTile({
        variables: { gameId, position },
      });
      const isMine = data.selectTile.isMine;
      setMultiplier(data.selectTile.multiplier);
      const roundedWinningAmount = parseFloat(
        data.selectTile.winningAmount.toFixed(4)
      );
      setWinningAmount(roundedWinningAmount);
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
  useEffect(() => {
    getWallet();
  }, []);

  const getWallet = async () => {
    try {
      const response = await fetch(`${url}/api/v1/user/wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      setWallet(res.data);
    } catch (error) {
      console.error("Error updating wallet:", error);
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
      const roundedWinningAmount = parseFloat(
        data.cashoutResult.winningAmount.toFixed(4)
      );
      const updatedWallet = parseFloat(
        (wallet + roundedWinningAmount).toFixed(4)
      );
      setGrid(
        data.cashoutResult.mineField.map((cell) => (cell === "M" ? mine : gem))
      );
      setMineCount(data.cashoutResult.mineCount);
      setBetAmount(data.cashoutResult.betAmount);
      setMultiplier(data.cashoutResult.multiplier);
      setWinningAmount(roundedWinningAmount);
      setWallet(updatedWallet);
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
  const toggleWalletPopup = async () => {
    try {
      const response = await fetch(
        `${url}/api/v1/payment/verify-bank-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const bankDetails = await response.json();

      if (!bankDetails.added) {
        navigate("/bank-details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
    setToggleWallet(!toggleWallet);
  };
  return (
    <div className="select-none bg-gradient-to-br bg-gray-900 text-white min-h-screen">
      <div className="text-center grid grid-cols-2 place-items-end pt-4">
        <h1 className="text-3xl font-bold mr-[-5rem]">Mine Game</h1>
        <h1 className="mr-4">Hello, {username}</h1>
      </div>
      <div className="flex flex-col items-center justify-center p-8">
        <span className="bg-gray-800 rounded-lg">
          <span className="px-2 py-3">
            {" "}
            {wallet <= 0 ? "0.0000 ₹" : wallet + " ₹"}{" "}
          </span>
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
          UpdateWallet={() => getWallet()}
          onClose={() => setToggleWallet(false)}
        />
      )}
      <div className="flex justify-center items-center">
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
          {/* GAME GUIDE */}
          <div className="mt-4">
            <h2
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="text-sm border-b-2 w-fit rounded-md mb-2 p-2 border-gray-700 cursor-pointer"
            >
              Click here for game guide {isGuideOpen ? `▲` : `▼`}
            </h2>
            {isGuideOpen && (
              <>
                <p className="text-sm">
                  1. Select the number of mines you want to play with.
                </p>
                <p className="text-sm">
                  2. Click on the tiles to reveal the hidden gems.
                </p>
                <p className="text-sm">
                  3. If you reveal a mine, the game is over.
                </p>
                <p className="text-sm">
                  4. Cashout your winnings before hitting a mine.
                </p>
              </>
            )}
          </div>

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
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-5 gap-4 w-full mx-auto p-5">
            {grid.map((cell, index) => (
              <div
                key={index}
                onClick={() => handleTileClick(index)}
                className="hover:transition-transform hover:scale-105 bg-gray-800 hover:bg-gray-700 relative flex items-center justify-center w-20 h-20 border-2 border-gray-700 rounded-lg cursor-pointer"
              >
                <div
                  className={`${
                    selectedTiles[index]
                      ? "border-2 bg-gray-500 rounded-lg"
                      : ""
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
      </div>
    </div>
  );
};

export default MineGameDesktop;
