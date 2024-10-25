import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const AddBankDetails = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/v1/user/save-bank-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify(data),
        }
      );
      const response = await res.json();
      if (response.statusCode > 400 && response.statusCode < 500) {
        toast.error(response.message);
      }
      if (response.statusCode >= 200 && response.statusCode < 300) {
        Cookies.set("isBankDetailsFilled", true);
        navigate("/casino/mines");
      }
    } catch (error) {
      console.log(error);
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-900 h-screen flex flex-col items-start justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto bg-gray-800 p-8 border border-gray-700 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-white">
          Add Your Bank Details
        </h2>
        <p className="mb-6 text-center text-gray-400">
          Secure your funds for a thrilling experience!
        </p>

        <input
          {...register("mobileNumber")}
          placeholder="Mobile No"
          className="w-full p-3 mb-4 border border-gray-600 rounded bg-gray-700 text-white"
          required
        />
        <input
          {...register("accountNumber")}
          placeholder="Account No."
          className="w-full p-3 mb-4 border border-gray-600 rounded bg-gray-700 text-white"
          required
        />
        <input
          {...register("confirmAccountNumber")}
          placeholder="Confirm Account No."
          className="w-full p-3 mb-4 border border-gray-600 rounded bg-gray-700 text-white"
          required
        />
        <input
          {...register("ifsc")}
          placeholder="IFSC"
          className="w-full p-3 mb-4 border border-gray-600 rounded bg-gray-700 text-white"
          required
        />
        <input
          {...register("beneficiaryName")}
          placeholder="Beneficiary Name"
          className="w-full p-3 mb-4 border border-gray-600 rounded bg-gray-700 text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-500 text-white p-3 rounded transition duration-200"
        >
          Add Bank Details
        </button>
      </form>
    </div>
  );
};

export default AddBankDetails;
