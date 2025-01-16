interface FileUploadProgressProps {
  filename: string;
  progress: number;
}

export default function FileUploadProgress({ filename, progress }: FileUploadProgressProps) {
  return (
    <div className="flex-1 p-3 rounded-lg bg-blue-50 border border-blue-200">
      <div className="flex items-center gap-3 mb-2">
        <svg
          className="h-5 w-5 text-blue-600 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <div className="flex-1">
          <div className="text-sm font-medium text-blue-800 mb-1">
            Téléchargement en cours...
          </div>
          <div className="text-xs text-blue-600">{filename}</div>
        </div>
        <div className="text-sm font-medium text-blue-800">
          {Math.round(progress)}%
        </div>
      </div>
      <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
