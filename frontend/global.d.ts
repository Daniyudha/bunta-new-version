// global.d.ts

import type { NextRequest, NextResponse } from 'next/server';

/**
 * Override typing Next.js supaya tidak paksa params jadi Promise<{id:string}>
 * sesuai dokumentasi resmi (params langsung object).
 */
declare module 'next' {
  export interface Params<T = Record<string, string>> {
    params: T;
  }

  export type RouteHandler<
    TParams extends Record<string, string> = Record<string, string>
  > = (
    req: NextRequest,
    context: Params<TParams>
  ) => Promise<NextResponse> | NextResponse;
}
