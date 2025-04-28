import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Account, Client } from 'appwrite'

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("680f3962002aecf25632");

const account = new Account(client);


const ADMIN_ROLE = 'admin';

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl
  const session = request.cookies.get('a_session_web')

  if (pathname.startsWith('/admin')) {
    if (!session) {
      const loginUrl = new URL('/admin/login', origin)
      return NextResponse.redirect(loginUrl)
    }
    try {
      const user = await account.get()
        const isAdministrator = user.roles.includes(ADMIN_ROLE);

        if (!isAdministrator) {
          const loginUrl = new URL('/admin/login', origin)
          return NextResponse.redirect(loginUrl)
      }

      return NextResponse.next()
    } catch (error) {
        const loginUrl = new URL('/admin/login', origin)
        return NextResponse.redirect(loginUrl)
    }



  } else if (pathname.startsWith('/profile') || pathname.startsWith('/wishlist') || pathname.startsWith('/cart')) {
    if (!session) {
        const loginUrl = new URL('/login', origin)
        return NextResponse.redirect(loginUrl)
    }
    try {
      await account.get()
      return NextResponse.next()
    } catch (error) {
      const loginUrl = new URL('/login', origin)
      return NextResponse.redirect(loginUrl)
    }
  } else{
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/wishlist/:path*', '/cart/:path*'],
}