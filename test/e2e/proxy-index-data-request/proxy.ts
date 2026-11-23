import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response =
    pathname === '/'
      ? NextResponse.rewrite(new URL('/landing', request.url))
      : NextResponse.next()

  response.headers.set('x-proxy-pathname', pathname)
  return response
}
