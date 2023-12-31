'use server'

// NOTE: In the future, we may need redis, don;t delete this
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { type Chat } from '~/lib/types'
import { auth } from '~/server/auth'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    for (const chat of chats) {
      pipeline.hgetall(chat)
      // TODO: Redundant, but needed for now
      pipeline.hget(chat, 'userId') // Additional hget for 'userId'
    }

    const results = await pipeline.exec()
    const formattedChats: Chat[] = []

    // TODO: Redundant, but needed for now
    // Pairing the results - assuming even indices have chat data and odd indices have userId
    for (let i = 0; i < results.length; i += 2) {
      const chat = results[i] as Chat
      const chatUserId = results[i + 1] as string
      formattedChats.push({ ...chat, userId: chatUserId })
    }

    return formattedChats
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)
  // TODO: Redundant, but needed for now
  const chatUserId = await kv.hget<string>(`chat:${id}`, 'userId')

  if (!chat || (userId && chatUserId !== userId)) {
    return null
  }

  return {
    ...chat,
    // TODO: Redundant, but needed for now
    userId: chatUserId
  }
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  const uid = await kv.hget<string>(`chat:${id}`, 'userId')

  if (uid !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chats: string[] = await kv.zrange(`user:chat:${session.user.id}`, 0, -1)
  if (!chats.length) {
    return redirect('/')
  }
  const pipeline = kv.pipeline()

  for (const chat of chats) {
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${session.user.id}`, chat)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat?.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(chat: Chat) {
  const session = await auth()

  if (!session?.user?.id || session.user.id !== chat.userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await kv.hset(`chat:${chat.id}`, payload)

  return payload
}
