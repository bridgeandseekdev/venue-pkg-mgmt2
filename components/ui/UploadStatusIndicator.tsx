import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/tailwindUtils';

type UploadStatusIndicatorProps = {
  status: 'uploading' | 'success' | 'error' | null;
  classname?: string;
};

export const UploadStatusIndicator = ({
  status,
  classname,
}: UploadStatusIndicatorProps) => {
  if (!status) return null;

  return (
    <div
      className={cn(
        'absolute -top-4 -right-1 z-10 rounded-full p-1.5',
        'transition-all duration-300 ease-in-out',
        {
          'bg-white/80 border-black/40 backdrop-blur-sm shadow-lg':
            status === 'uploading',
          'bg-green-100/90 border border-green-600/40 backdrop-blur-md':
            status === 'success',
          'bg-red-100/90 border border-red-600/40 backdrop-blur-md':
            status === 'error',
        },
        classname,
      )}
    >
      {status === 'uploading' && (
        <Loader2 className="h-5 w-5 text-slate-600 animate-spin" />
      )}
      {status === 'success' && (
        <CheckCircle className="h-5 w-5 text-green-600 animate-in fade-in duration-300" />
      )}
      {status === 'error' && (
        <XCircle className="h-5 w-5 text-red-600 animate-in fade-in duration-300" />
      )}
    </div>
  );
};
