import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 text-white">
        <Link
          to="/casino/magic-number"
          className="border-4 p-3 rounded-3xl transition ease-in-out delay-15 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 ..."
        >
          Play Now
        </Link>
      </div>
    </>
  );
};

export default HomePage;