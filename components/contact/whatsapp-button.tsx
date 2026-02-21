'use client';

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

interface WhatsAppButtonProps {
  whatsappNumber: string;
}

export function WhatsAppButton({ whatsappNumber }: WhatsAppButtonProps) {
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const message = encodeURIComponent('Merhaba, bilgi almak istiyorum.');

  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center h-11 rounded-md px-6 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors mt-6"
    >
      <WhatsAppIcon className="mr-2 h-5 w-5" />
      WhatsApp ile İletişime Geç
    </a>
  );
}
