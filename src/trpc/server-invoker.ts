'use server'

import { cookies, headers } from 'next/headers'
import { loggerLink } from '@trpc/client'
import { experimental_nextCacheLink } from '@trpc/next/app-dir/links/nextCache'
import { experimental_createTRPCNextAppDirServer } from '@trpc/next/app-dir/server'

import { appRouter, type AppRouter } from '~/server/api/root'
import { auth } from '~/server/auth'
import { db } from '~/server/db'

import { transformer } from './shared'

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer,
      links: [
        loggerLink({
          enabled: op =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error)
        }),
        experimental_nextCacheLink({
          // requests are cached for 5 seconds
          revalidate: 5,
          router: appRouter,
          createContext: async () => {
            return {
              session: await auth(),
              headers: {
                ...headers(),
                cookie: cookies().toString(),
                'x-trpc-source': 'rsc-invoke'
              },
              db
            }
          }
        })
      ]
    }
  }
})
