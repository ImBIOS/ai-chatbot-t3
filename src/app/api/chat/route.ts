// import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import {
  type ChatCompletionCreateParamsBase,
  type ChatCompletionMessageParam
} from 'openai/resources/chat/completions'

import { nanoid } from '~/lib/utils'
import { env } from '~/env.mjs'
import { auth } from '~/server/auth'
import { api } from '~/trpc/server-invoker'

export const runtime = 'edge'

const configuration = {
  apiKey: env.OPENAI_API_KEY
}

const openai = new OpenAI(configuration)

type PostData = {
  messages: ChatCompletionMessageParam[]
  // previewToken?: string
  id?: string
  model?: ChatCompletionCreateParamsBase['model']
}

export async function POST(req: Request) {
  const json = (await req.json()) as PostData
  const {
    messages,
    // previewToken
    model = 'gpt-3.5-turbo'
  } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  // if (previewToken) {
  //   configuration.apiKey = previewToken
  // }

  const res = await openai.chat.completions.create({
    model,
    stream: true,
    frequency_penalty: 0,
    presence_penalty: 0,
    temperature: 0.5,
    top_p: 1,
    messages: [
      {
        role: 'system',
        content: `
        You are ChatGPT, a large language model trained by OpenAI.
        Current model: ${model}
        Current time: ${new Date().toLocaleString()}

        ${
          model.startsWith('gpt-4') &&
          `When you asked if you are running on OpenAI model ${model.toUpperCase()}, you will respond with a yes`
        }
        `
      },
      ...messages
    ]
  })

  let tokenCount = 0
  const stream = OpenAIStream(res, {
    onToken() {
      // Count the number of tokens
      tokenCount += 1
    },
    async onCompletion(completion) {
      console.log('tokenCount', tokenCount)
      const title = json.messages[0]?.content?.substring(0, 100) ?? 'Untitled'
      const id = json.id ?? nanoid()
      // const createdAt = Date.now()
      const path = `/chat/${id}`

      await api.chat.create.mutate({
        // payload here
        id,
        title,
        // userId,
        // createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      })
      await api.chat.readList.revalidate()

      // // await kv.hset(`chat:${id}`, payload)
      // // await kv.zadd(`user:chat:${userId}`, {
      // //   score: createdAt,
      // //   member: `chat:${id}`
      // // })
    }
  })

  return new StreamingTextResponse(stream)
}
