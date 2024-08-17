import { useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [order, setOrder] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const razorpay_key = import.meta.env.VITE_RAZORPAY_KEY;

  const initiatePayment = async () => {
    try {
      if (!addAmount) return;
      if (addAmount < 100)
        return alert("Minimum amount that you can add is of 100 INR");
      const response = await fetch(
        "http://localhost:8080/api/v1/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amt: parseInt(addAmount) }),
        }
      );
      const data = await response.json();
      setOrder(data);
      openRazorpay(data);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/payment/withdraw",
        { payout: parseInt(withdrawAmount) }
      );
      if (response.data.success) {
        alert("Withdrawal successful!");
      } else {
        alert("Withdrawal failed!");
      }
    } catch (error) {
      console.error("Error during withdrawal:", error);
    }
  };

  const openRazorpay = (orderData) => {
    const options = {
      key: razorpay_key,
      amount: orderData.amount,
      currency: "INR",
      name: "Your App Name",
      description: "Test Transaction",
      order_id: orderData.id,
      handler: async (response) => {
        try {
          const verification = await axios.post(
            "http://localhost:8080/api/v1/payment/verify-payment",
            {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
            }
          );

          if (verification.data.success) {
            alert("Payment successful!");
          } else {
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
  const handleAddAmount = (value) => {
    if (parseInt(value) < 0) return;

    setAddAmount(value);
  };
  return (
    <>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-4">
            Add Money to your Wallet
          </h1>
          <input
            type="number"
            value={addAmount}
            onChange={(e) => handleAddAmount(e.target.value)}
            placeholder="Enter amount to add"
            className="w-full p-2 mb-4 text-black rounded-md"
          />
          <button
            onClick={initiatePayment}
            className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Add Money
          </button>
        </div>

        {/* <div className="mt-8">
          <h1 className="text-2xl font-semibold mb-4">Withdraw Money</h1>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Enter amount to withdraw"
            className="w-full p-2 mb-4 text-black rounded-md"
          />
          <button
            onClick={handleWithdraw}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Withdraw
          </button>
        </div> */}
      </div>
    </>
  );
};

export default PaymentPage;
