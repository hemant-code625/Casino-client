import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Login = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${url}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (response.statusCode > 400 && response.statusCode < 500) {
        reset();
        toast.error(response.message);
      }
      if (response.statusCode >= 200 && response.statusCode < 300) {
        Cookies.set("accessToken", response.data.accessToken, { expires: 1 });
        Cookies.set("refreshToken", response.data.refreshToken, {
          expires: 7,
        });
        navigate("/casino/mines");
      }
    } catch (error) {
      console.log(error);
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <>
      <div className="bg-gray-900 h-screen flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto bg-gray-800 p-8 border border-gray-700 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-4 text-center text-white">
            Welcome Back!
          </h2>
          <p className="mb-6 text-center text-gray-400">
            Your gateway to thrilling bets awaits!
          </p>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-600 rounded bg-gray-700 text-white"
            required
          />
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border border-gray-600 rounded bg-gray-700 text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded transition duration-200"
          >
            Login
          </button>
          <p className="text-white mt-4">
            Don&apos;t have an account? Click here to get{" "}
            <span
              onClick={() => navigate("/register")}
              className="underline cursor-pointer"
            >
              started
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
