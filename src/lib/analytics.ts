import type { NextApiRequest } from 'next'
import type { NextFetchEvent, NextRequest } from 'next/server'

import { env } from '~/env.mjs'

export const initAnalytics = ({
  request,
  event
}: {
  request: NextRequest | NextApiRequest | Request
  event?: NextFetchEvent
}) => {
  const endpoint = process.env.VERCEL_URL

  return {
    track: async (eventName: string, data?: unknown) => {
      try {
        if (!endpoint && env.NODE_ENV === 'development') {
          console.info(
            `[Vercel Web Analytics] Track "${eventName}"` +
              (data ? ` with data ${JSON.stringify(data || {})}` : '')
          )
          return
        }

        const headers: Record<string, string> = {}
        Object.entries(request.headers).map(([key, value]) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          headers[key] = value
        })

        const body = {
          o: headers.referer,
          ts: new Date().getTime(),
          r: '',
          en: eventName,
          ed: data
        }

        const promise = fetch(
          `https://${process.env.VERCEL_URL}/_vercel/insights/event`,
          {
            headers: {
              'content-type': 'application/json',
              'user-agent': headers['user-agent']!,
              'x-forwarded-for': headers['x-forwarded-for']!,
              'x-va-server': '1'
            },
            body: JSON.stringify(body),
            method: 'POST'
          }
        )

        if (event) {
          event.waitUntil(promise)
        }
        {
          await promise
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}
