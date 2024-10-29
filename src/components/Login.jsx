import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useState } from "react";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  const onSubmit = async (data) => {
    setLoading(true);
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
        setLoading(false);
        toast.error(response.message);
      }
      if (response.statusCode >= 200 && response.statusCode < 300) {
        Cookies.set("accessToken", response.data.accessToken, { expires: 1 });
        Cookies.set("refreshToken", response.data.refreshToken, {
          expires: 7,
        });
        setLoading(false);
        navigate("/casino/mines");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
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
            disabled={loading}
          >
            {loading ? (
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
              </div>
            ) : (
              "Login"
            )}
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
