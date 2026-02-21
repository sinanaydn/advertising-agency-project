import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Sayfa Bulunamadı</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center h-10 rounded-md px-6 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
