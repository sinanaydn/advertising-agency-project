import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('about_page')
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('About fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Hakkımızda bilgisi yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, mission, vision } = body;

    // Get existing record id
    const { data: existing } = await supabase
      .from('about_page')
      .select('id')
      .single();

    if (!existing) {
      // Insert if no record exists
      const { data, error } = await supabase
        .from('about_page')
        .insert([{ content, mission, vision }])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    // Update existing
    const { data, error } = await supabase
      .from('about_page')
      .update({ content, mission, vision })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('About update error:', error);
    return NextResponse.json(
      { success: false, error: 'Güncelleme başarısız' },
      { status: 500 }
    );
  }
}
