export default function CheckEmailModal({ email, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Check Your Email
          </h3>
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a magic sign-in link to
            <br />
            <strong className="text-gray-800">{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please click the link in the email to sign in.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
