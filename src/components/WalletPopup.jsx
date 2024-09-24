/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const WalletPopup = ({ isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState("addMoney");
  const [amount, setAmount] = useState(0);
  const [, setOrder] = useState(null);

  const razorpay_key = import.meta.env.VITE_RAZORPAY_KEY;
  const url = import.meta.env.VITE_API_URL;

  const handleDeposit = async () => {
    try {
      if (amount < 100)
        return toast.error("Minimum deposit amount must be ₹100");
      const response = await fetch(`${url}/api/v1/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amt: parseInt(amount) }),
      });
      const data = await response.json();
      setOrder(data);
      openRazorpay(data);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };
  const openRazorpay = (orderData) => {
    const options = {
      key: razorpay_key,
      amount: orderData.amount,
      currency: "INR",
      name: "Amingo",
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
              Deposit
            </button>
          ) : (
            <button
              onClick={handleWithdraw}
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Withdraw
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPopup;
