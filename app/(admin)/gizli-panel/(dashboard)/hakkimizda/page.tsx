'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle } from 'lucide-react';

export default function AdminAboutPage() {
  const [content, setContent] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch('/api/about');
        const result = await res.json();
        if (result.success && result.data) {
          setContent(result.data.content || '');
          setMission(result.data.mission || '');
          setVision(result.data.vision || '');
        }
      } catch {
        setError('Veriler yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    }
    fetchAbout();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mission, vision }),
      });

      const result = await res.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Güncelleme başarısız');
      }
    } catch {
      setError('Bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Hakkımızda</h1>

      <div className="max-w-2xl space-y-6">
        <div>
          <Label htmlFor="content">İçerik</Label>
          <Textarea
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Şirket hakkında genel bilgi..."
          />
        </div>

        <div>
          <Label htmlFor="mission">Misyon</Label>
          <Textarea
            id="mission"
            rows={4}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="Misyonunuz..."
          />
        </div>

        <div>
          <Label htmlFor="vision">Vizyon</Label>
          <Textarea
            id="vision"
            rows={4}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="Vizyonunuz..."
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {success && (
          <p className="text-sm text-green-500 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Başarıyla kaydedildi
          </p>
        )}

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Kaydet
        </Button>
      </div>
    </div>
  );
}
