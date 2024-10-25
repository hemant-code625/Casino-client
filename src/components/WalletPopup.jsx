/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const WalletPopup = ({ isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState("addMoney");
  const [amount, setAmount] = useState(0);
  const [, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const razorpay_key = import.meta.env.VITE_RAZORPAY_KEY;
  const url = import.meta.env.VITE_API_URL;

  const handleDeposit = async () => {
    try {
      if (amount < 100)
        return toast.error("Minimum deposit amount must be ₹100");

      setLoading(true);
      const response = await fetch(`${url}/api/v1/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amt: parseInt(amount) }),
      });
      const data = await response.json();
      setLoading(false);
      setOrder(data);
      openRazorpay(data);
    } catch (error) {
      setLoading(false);
      console.error("Error creating order:", error);
    }
  };
  const openRazorpay = (orderData) => {
    const options = {
      key: razorpay_key,
      amount: orderData.amount,
      currency: "INR",
      name: "Amingoo",
      description: "Test Transaction",
      order_id: orderData.id,
      handler: async (response) => {
        try {
          const verification = await axios.post(
            `${url}/api/v1/payment/verify-payment`,
            {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
            }
          );

          if (verification.data.success) {
            setAmount(0);
            onClose();
          } else {
            setAmount(0);
            alert("Payment failed!");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
        }
      },
      prefill: {
        name: "John Doe",
        email: "johndoe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleWithdraw = () => {
    toast.info("Withdrawal feature is not available yet");
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] ${
        isOpen ? "block" : "hidden"
      } bg-black bg-opacity-50`}
    >
      <div className="bg-gray-900 rounded-lg shadow-lg w-96 p-8 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-100 focus:outline-none"
          onClick={onClose}
        >
          &#10005;
        </button>

        <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Wallet
        </h2>

        {/* Tabs */}
        <div className="flex justify-around mb-6">
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedTab === "addMoney"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setSelectedTab("addMoney")}
          >
            Add Money
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedTab === "withdraw"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setSelectedTab("withdraw")}
          >
            Withdraw
          </button>
        </div>

        {/* Form for both tabs */}
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              min={0}
              placeholder="Enter amount"
              onChange={(e) => setAmount(e.target.value)}
              className="px-4 py-2 mb-2 w-full text-white bg-gray-700 rounded-lg"
            />
          </div>
          {selectedTab === "addMoney" ? (
            <button
              onClick={handleDeposit}
              className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {loading ? (
                <>
                  {" "}
                  <span>
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
                  </span>{" "}
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                "Deposit"
              )}
            </button>
          ) : (
            <button
              onClick={handleWithdraw}
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {loading ? (
                <>
                  {" "}
                  <span>
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
                  </span>{" "}
                  <span className="ml-2">Processing...</span>
                </>
              ) : (
                "Withdraw"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPopup;
