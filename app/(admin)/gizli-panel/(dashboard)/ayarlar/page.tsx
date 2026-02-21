'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle } from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: string;
  label: string;
  group: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        const result = await res.json();
        if (result.success && result.data) {
          setSettings(result.data);
          const vals: Record<string, string> = {};
          result.data.forEach((s: Setting) => {
            vals[s.key] = s.value;
          });
          setValues(vals);
        }
      } catch {
        setError('Ayarlar yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess(false);

    try {
      const updates = settings.map((s) =>
        fetch(`/api/settings/${s.key}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: values[s.key] || '' }),
        })
      );

      const results = await Promise.all(updates);
      const allOk = results.every((r) => r.ok);

      if (allOk) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Bazı ayarlar güncellenemedi');
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

  // Group settings
  const groups = settings.reduce<Record<string, Setting[]>>((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {});

  const groupLabels: Record<string, string> = {
    contact: 'İletişim Bilgileri',
    general: 'Genel Ayarlar',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Site Ayarları</h1>

      <div className="max-w-2xl space-y-8">
        {Object.entries(groups).map(([group, groupSettings]) => (
          <div key={group}>
            <h2 className="text-xl font-semibold mb-4">
              {groupLabels[group] || group}
            </h2>
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              {groupSettings.map((setting) => (
                <div key={setting.key}>
                  <Label htmlFor={setting.key}>{setting.label}</Label>
                  <Input
                    id={setting.key}
                    value={values[setting.key] || ''}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [setting.key]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {success && (
          <p className="text-sm text-green-500 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Ayarlar kaydedildi
          </p>
        )}

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Tümünü Kaydet
        </Button>
      </div>
    </div>
  );
}
