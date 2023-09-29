import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;

    const orgId = request.cookies.get('orgId')?.value ?? 1;

    const access = request.cookies.get('access')?.value;

    if (access && orgId) {
        /*for (const elem of headCheckData) {
            if (url.pathname.startsWith(elem.href)) {
                const res = await headCheckPathsMiddleware(
                    elem.head,
                    elem.href,
                    access,
                    +orgId
                );
                if (res) {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }
        }*/
    }

    if (!url.pathname.startsWith('/login')) {
        if (!request.cookies.get('access')?.value) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
