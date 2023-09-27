import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { headCheckData } from 'app/(Main)/components/SideLinks/sidebarCheckAccess';
import { headCheckPathsMiddleware } from 'http/userApi';

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;

    const orgId = request.cookies.get('orgId')?.value ?? 1;

    const access = request.cookies.get('access')?.value;

    const headCheck = await Promise.all(
        headCheckData.map(async (elem) => {
            return await headCheckPathsMiddleware(
                elem.head as string,
                elem.href,
                access as string,
                +orgId
            );
        })
    );

    headCheckData.forEach((elem) => {
        if (
            headCheck.includes(elem.href) &&
            url.pathname.startsWith(elem.href)
        ) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    });

    if (!url.pathname.startsWith('/login')) {
        if (!request.cookies.get('access')?.value) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
