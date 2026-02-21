'use client';

import { usePathname } from 'next/navigation';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

interface WhatsAppFloatingProps {
  whatsappNumber: string;
}

export function WhatsAppFloating({ whatsappNumber }: WhatsAppFloatingProps) {
  const pathname = usePathname();

  // Hide on admin pages or if no number configured
  if (!whatsappNumber || pathname.startsWith('/gizli-panel')) return null;

  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const message = encodeURIComponent('Merhaba, bilgi almak istiyorum.');

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-200"
      aria-label="WhatsApp ile iletişime geç"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
