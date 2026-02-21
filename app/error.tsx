'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Bir Hata Oluştu</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Sayfa yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.
      </p>
      <Button onClick={reset}>Tekrar Dene</Button>
    </div>
  );
}
