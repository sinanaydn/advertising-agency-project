'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { DeleteDialog } from '@/components/admin/delete-dialog';
import { Mail, MailOpen, Trash2, Phone, Calendar, Tag } from 'lucide-react';
import type { ContactMessage } from '@/types';

interface MessageListProps {
  messages: ContactMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: !currentRead }),
      });

      const result = await res.json();
      if (result.success) {
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, is_read: !currentRead });
        }
        router.refresh();
      }
    } catch {
      alert('Bir hata oluştu');
    } finally {
      setLoadingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setLoadingId(deleteTarget.id);
    try {
      const res = await fetch(`/api/contact/${deleteTarget.id}`, { method: 'DELETE' });
      const result = await res.json();

      if (result.success) {
        if (selectedMessage?.id === deleteTarget.id) {
          setSelectedMessage(null);
        }
        setDeleteTarget(null);
        router.refresh();
      } else {
        alert(result.error || 'Silme başarısız');
      }
    } catch {
      alert('Bir hata oluştu');
    } finally {
      setLoadingId(null);
    }
  };

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + '...' : text;

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Henüz mesaj yok.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={`transition-colors cursor-pointer hover:border-primary/30 ${
              !msg.is_read ? 'border-primary/50 bg-primary/5' : ''
            }`}
            onClick={() => setSelectedMessage(msg)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{msg.name}</span>
                    {!msg.is_read && (
                      <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                        Yeni
                      </span>
                    )}
                  </div>

                  {msg.subject && (
                    <p className="text-sm font-medium mb-2">{msg.subject}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {msg.email}
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {msg.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(msg.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {truncate(msg.message, 200)}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRead(msg.id, msg.is_read);
                    }}
                    disabled={loadingId === msg.id}
                    title={msg.is_read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
                  >
                    {msg.is_read ? (
                      <MailOpen className="h-3.5 w-3.5" />
                    ) : (
                      <Mail className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ id: msg.id, name: msg.name });
                    }}
                    disabled={loadingId === msg.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`"${deleteTarget?.name}" mesajını silmek istediğinize emin misiniz?`}
        isDeleting={loadingId === deleteTarget?.id}
      />

      {/* Message Detail Modal */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        {selectedMessage && (
          <>
            <DialogClose onClose={() => setSelectedMessage(null)} />
            <DialogHeader>
              <DialogTitle>{selectedMessage.name}</DialogTitle>
            </DialogHeader>

            {selectedMessage.subject && (
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{selectedMessage.subject}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {selectedMessage.email}
              </span>
              {selectedMessage.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {selectedMessage.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(selectedMessage.created_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="rounded-md bg-muted/50 p-4 mb-6">
              <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.is_read)}
                disabled={loadingId === selectedMessage.id}
              >
                {selectedMessage.is_read ? (
                  <>
                    <Mail className="mr-2 h-3.5 w-3.5" />
                    Okunmadı İşaretle
                  </>
                ) : (
                  <>
                    <MailOpen className="mr-2 h-3.5 w-3.5" />
                    Okundu İşaretle
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteTarget({ id: selectedMessage.id, name: selectedMessage.name })}
                disabled={loadingId === selectedMessage.id}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Sil
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
}
