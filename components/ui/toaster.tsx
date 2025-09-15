"use client";
// Basic toaster component stub
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`relative pointer-events-auto w-full overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all ${
            toast.variant === 'destructive' 
              ? 'border-destructive bg-destructive text-destructive-foreground' 
              : 'border bg-background text-foreground'
          }`}
        >
          {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
          {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
        </div>
      ))}
    </div>
  );
}