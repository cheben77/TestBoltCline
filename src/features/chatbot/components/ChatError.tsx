interface ChatErrorProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ChatError({ message, onRetry, onDismiss }: ChatErrorProps) {
  return (
    <div className="flex justify-center mb-4">
      <div className="bg-red-100 text-red-800 rounded-lg p-3 max-w-[80%]">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{message}</p>
            <div className="mt-2 flex space-x-4">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Réessayer
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Fermer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatError;
