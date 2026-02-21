import { createClient } from '@/lib/supabase/server';
import { MessageList } from '@/components/admin/message-list';

export default async function MessagesPage() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  const unreadCount = messages?.filter((m) => !m.is_read).length || 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">Mesajlar</h1>
        {unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground text-sm px-2.5 py-0.5 rounded-full">
            {unreadCount} okunmamış
          </span>
        )}
      </div>

      <MessageList messages={messages || []} />
    </div>
  );
}
