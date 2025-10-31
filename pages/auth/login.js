import { useState } from "react";
import { useRouter } from "next/router";
import CheckEmailModal from "../../components/Auth/CheckEmailModal"; // Import the new modal

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCheckEmailModal, setShowCheckEmailModal] = useState(false); // State to control the modal
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://backend-scorecard.onrender.com/api/magic-link/send-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            url: `${window.location.origin}/auth/callback`,
          }),
        }
      );

      setLoading(false);

      if (response.ok) {
        // Instead of redirecting, show the modal
        setShowCheckEmailModal(true);
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to send link. Please check your connection.");
    }
  };

  return (
    <>
      {/* Conditionally render the modal */}
      {showCheckEmailModal && (
        <CheckEmailModal
          email={email}
          onClose={() => setShowCheckEmailModal(false)}
        />
      )}

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-white rounded shadow-md w-96"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-black">
            Sign In
          </h1>
          <p className="mb-4 text-gray-600 text-center">
            Enter your email to receive a magic sign-in link.
          </p>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}
        </form>
      </div>
    </>
  );
}
