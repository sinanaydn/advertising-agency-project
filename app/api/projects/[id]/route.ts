import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { projectWithImagesSchema } from '@/lib/validations/project';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        category:categories(*),
        images:project_images(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Proje bulunamadı' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Update project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();

    if (projectError) throw projectError;

    // Get existing images
    const { data: existingImages } = await supabase
      .from('project_images')
      .select('id, storage_path')
      .eq('project_id', id);

    const existingPaths = new Set(existingImages?.map((img) => img.storage_path) || []);
    const newPaths = new Set(images.map((img) => img.path));

    // Delete removed images from storage
    const removedImages = existingImages?.filter(
      (img) => !newPaths.has(img.storage_path)
    ) || [];

    if (removedImages.length > 0) {
      const pathsToDelete = removedImages.map((img) => img.storage_path);
      await supabase.storage.from('project-images').remove(pathsToDelete);

      await supabase
        .from('project_images')
        .delete()
        .in('id', removedImages.map((img) => img.id));
    }

    // Insert new images
    const newImages = images.filter((img) => !existingPaths.has(img.path));
    if (newImages.length > 0) {
      const imageData = newImages.map((img) => ({
        project_id: id,
        image_url: img.url,
        storage_path: img.path,
        alt_text: img.alt_text || projectData.title,
        display_order: img.display_order,
        width: img.width,
        height: img.height,
      }));

      await supabase.from('project_images').insert(imageData);
    }

    // Update display_order for existing images that remain
    for (const img of images) {
      if (existingPaths.has(img.path)) {
        await supabase
          .from('project_images')
          .update({ display_order: img.display_order })
          .eq('project_id', id)
          .eq('storage_path', img.path);
      }
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json(
      { success: false, error: 'Proje güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get images to delete from storage
    const { data: images } = await supabase
      .from('project_images')
      .select('storage_path')
      .eq('project_id', id);

    if (images && images.length > 0) {
      const paths = images.map((img) => img.storage_path);
      await supabase.storage.from('project-images').remove(paths);
    }

    // Delete project (CASCADE deletes project_images rows)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Project delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Proje silinemedi' },
      { status: 500 }
    );
  }
}
