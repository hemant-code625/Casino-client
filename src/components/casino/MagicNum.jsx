import Grid from "./Grid";

const MagicNum = () => {
  const betAmount = 0;
  return (
    <>
      <h1 className="mt-3 text-center text-3xl font-bold">Amingo</h1>
      <h3 className="text-center opacity-75">
        Online casino and opinion trading platform
      </h3>
      <div className="game-div">
        <div className="heading flex items-center justify-evenly mt-10">
          <div className="score">
            <h3>Score: 0</h3>
          </div>
          <div className="amount">
            <h3>Amount: 0</h3>
          </div>
        </div>
        <div className="game m-8">
          <div className="border w-4/5 h-4/6 m-auto">
            <div className="border w-1/4  flex flex-col items-start justify-start">
              <div>Bet Amount</div>
              <div>{betAmount}</div>
            </div>
            <Grid />
          </div>
        </div>
      </div>
    </>
  );
};

export default MagicNum;
