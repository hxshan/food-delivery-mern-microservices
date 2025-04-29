import { useNavigate } from "react-router-dom";

const Wait = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Please wait...</h1>
      <p className="text-gray-600 mb-6">We are verifying your account. This may take a few minutes.</p>
      
      <button
        onClick={handleGoToLogin}
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Go to Login
      </button>
    </div>
  );
};

export default Wait;
