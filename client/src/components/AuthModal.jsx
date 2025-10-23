// AuthModal.jsx - Handles the Login and Registration forms.

import { useState } from "react";
// We use useNavigate to redirect the user after a successful login/registration.
import { useNavigate } from "react-router-dom";
// We use a simple icon for the close button.
import { IoClose } from "react-icons/io5";

// This component will be passed visibility and close handlers as props
function AuthModal({ isVisible, onClose }) {
  // State to toggle between the Login and Register views.
  const [isLogin, setIsLogin] = useState(true);

  // State to handle the controlled input fields (Username, Email, Password).
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hook to handle navigation (redirecting to home page after login).
  const navigate = useNavigate();

  // Simple function to reset all input fields.
  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  // Placeholder for the form submission logic (login/register API calls).
  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the form from causing a page reload.
    console.log(`Submitting as ${isLogin ? "Login" : "Register"}:`, {
      username,
      email,
      password,
    });
    // The real API call logic will go here next.
  };

  // If the modal is not visible, return null so it doesn't render anything.
  if (!isVisible) return null;

  return (
    // The modal overlay: fixed full screen, centered content, semi-transparent black background.
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* The actual modal content container. */}
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? "Sign In" : "Register Account"}
          </h2>
          {/* Close Button */}
          <IoClose
            className="text-3xl cursor-pointer text-gray-500 hover:text-gray-900 transition-colors"
            onClick={onClose} // Calls the close function passed as a prop.
          />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field (Only visible during Registration) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                // We use an onChange handler to update the state, making it a controlled component.
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required={!isLogin} // Only required if registering.
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        {/* Switch between Login and Register */}
        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              resetForm();
            }}
            className="text-blue-600 hover:text-blue-800 font-medium ml-1"
          >
            {isLogin ? "Register Here" : "Sign In Here"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
