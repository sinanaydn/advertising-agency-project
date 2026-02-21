import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { categorySchema } from '@/lib/validations/category';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategoriler yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      console.error('Category validation error:', result.error.flatten());
      return NextResponse.json(
        { success: false, error: result.error.errors[0]?.message || 'Geçersiz veri' },
        { status: 400 }
      );
    }

    const insertData = {
      ...result.data,
      parent_id: result.data.parent_id || null,
    };

    const { data, error } = await supabase
      .from('categories')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Category create error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategori oluşturulamadı' },
      { status: 500 }
    );
  }
}
