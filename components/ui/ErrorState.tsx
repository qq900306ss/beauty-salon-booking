'use client';

import { CloudOff, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = '暫時無法載入內容，請稍後再試。',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-blush-100 bg-white/60 px-8 py-14 text-center">
      <CloudOff className="h-10 w-10 text-rosegold-300" />
      <p className="text-sm text-cocoa-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full border border-rosegold-300/60 px-5 py-2 text-sm text-rosegold-500 transition-colors hover:bg-blush-50"
        >
          <RotateCcw className="h-4 w-4" />
          重新載入
        </button>
      )}
    </div>
  );
}
