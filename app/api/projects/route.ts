import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { projectWithImagesSchema } from '@/lib/validations/project';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const showAll = searchParams.get('all') === 'true';
    const categoryId = searchParams.get('category_id');

    let query = supabase
      .from('projects')
      .select(`
        *,
        category:categories(*),
        images:project_images(*)
      `)
      .order('created_at', { ascending: false });

    if (!showAll) {
      query = query.eq('is_active', true);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Projects fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Projeler yüklenemedi' },
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
    const result = projectWithImagesSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz veri' },
        { status: 400 }
      );
    }

    const { images, ...projectData } = result.data;

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (projectError) throw projectError;

    if (images.length > 0) {
      const imageData = images.map((img) => ({
        project_id: project.id,
        image_url: img.url,
        storage_path: img.path,
        alt_text: img.alt_text || projectData.title,
        display_order: img.display_order,
        width: img.width,
        height: img.height,
      }));

      const { error: imagesError } = await supabase
        .from('project_images')
        .insert(imageData);

      if (imagesError) throw imagesError;
    }

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error('Project create error:', error);
    return NextResponse.json(
      { success: false, error: 'Proje oluşturulamadı' },
      { status: 500 }
    );
  }
}
