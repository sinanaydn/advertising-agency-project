import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Admin panel protection
  if (request.nextUrl.pathname.startsWith('/gizli-panel')) {
    // Allow login page without auth
    if (request.nextUrl.pathname === '/gizli-panel/giris') {
      if (user) {
        // Already authenticated, redirect to dashboard
        const url = request.nextUrl.clone();
        url.pathname = '/gizli-panel';
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    // All other admin routes require auth
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/gizli-panel/giris';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/gizli-panel/:path*'],
};
