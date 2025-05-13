import React, { useState } from "react";
import { 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement,
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";

const CardPaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const cardNumber = elements.getElement(CardNumberElement);
      const cardExpiry = elements.getElement(CardExpiryElement);
      const cardCvc = elements.getElement(CardCvcElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        console.log("Payment successful:", paymentMethod);
        // Send `paymentMethod.id` to your backend here
        setIsSuccess(true);
        
        // Reset form after success
        cardNumber.clear();
        cardExpiry.clear();
        cardCvc.clear();
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const elementStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "'Roboto', sans-serif",
      },
      invalid: {
        color: "#9e2146",
        iconColor: "#9e2146",
      },
    },
  };

  return (
    <div className="w-full max-w-md">
      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
          <svg className="w-6 h-6 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-green-800 font-medium">Payment Successful</h3>
          <p className="text-green-700 mt-1">Your payment has been processed successfully.</p>
          <button 
            className="mt-3 text-red-500 hover:text-red-700 font-medium"
            onClick={() => setIsSuccess(false)}
          >
            Make another payment
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-md shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Payment Details</h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter your card information to complete payment
              </p>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="border border-gray-300 p-3 rounded-md focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
                  <CardNumberElement options={elementStyle} />
                </div>
              </div>
              
              {/* Two columns for expiry and CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date
                  </label>
                  <div className="border border-gray-300 p-3 rounded-md focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
                    <CardExpiryElement options={elementStyle} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <div className="border border-gray-300 p-3 rounded-md focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
                    <CardCvcElement options={elementStyle} />
                  </div>
                </div>
              </div>
              
              {errorMessage && (
                <div className="mt-2 text-sm text-red-600">
                  <span className="font-medium">Error:</span> {errorMessage}
                </div>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-md transition duration-150 ease-in-out flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isProcessing || !stripe}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </button>
          
          <div className="flex items-center justify-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your payment information is secure and encrypted
          </div>
        </form>
      )}
    </div>
  );
};

export default CardPaymentForm;