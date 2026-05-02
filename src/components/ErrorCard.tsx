interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorCardProps) {
  return (
    <div className="bg-error-container rounded-xl p-6 border border-outline-variant">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-error">error_outline</span>
        </div>
        <div className="flex-1">
          <h3 className="font-label-lg text-on-error-container mb-1">{title}</h3>
          <p className="font-body-md text-on-error-container/80 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 bg-error text-on-error px-4 py-2 rounded-lg font-label-lg btn-press hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
