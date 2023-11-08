import { revalidatePath } from 'next/cache'
import { and, eq, sql } from 'drizzle-orm'
import { z } from 'zod'

import { nanoid } from '~/lib/utils'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { chats, messages } from '~/server/db/schema'

export const chatRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string(),
        path: z.string().min(1),
        messages: z.array(
          z.object({
            role: z.enum(['system', 'user', 'assistant', 'function']),
            content: z.string().nullable()
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(chats)
        .values({
          id: input.id,
          title: input.title,
          userId: ctx.session.user.id,
          path: input.path
        })
        .onDuplicateKeyUpdate({ set: { id: sql`id` } })

      const twoLastMessage = input.messages.slice(-2).map(message => ({
        id: nanoid(),
        content: message.content ?? '',
        role: message.role,
        chatId: input.id,
        userId: ctx.session.user.id
      }))
      await ctx.db.insert(messages).values(twoLastMessage)
    }),

  readList: protectedProcedure.query(({ ctx }) => {
    if (!ctx.session.user.id) {
      return []
    }

    const chatList = ctx.db.query.chats.findMany({
      orderBy: (chats, { desc }) => [desc(chats.createdAt)],
      limit: 10,
      where: eq(chats.userId, ctx.session.user.id)
    })
    const messageCount = ctx.db
      .select({ count: sql`COUNT(*)` })
      .from(messages)
      .where(eq(messages.userId, ctx.session.user.id))

    const response = {
      chatList,
      messageCount
    }

    // return response
  }),

  readDetail: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.chats.findFirst({
        where: and(
          eq(chats.id, input.id),
          eq(chats.userId, ctx.session.user.id)
        ),
        with: {
          messages: true
        }
      })
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        path: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Delete chat
      await ctx.db
        .delete(chats)
        .where(
          and(eq(chats.id, input.id), eq(chats.userId, ctx.session.user.id))
        )

      // Delete messages
      await ctx.db
        .delete(messages)
        .where(
          and(
            eq(messages.chatId, input.id),
            eq(messages.userId, ctx.session.user.id)
          )
        )

      revalidatePath('/')
      return revalidatePath(input.path)
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.delete(chats).where(eq(chats.userId, ctx.session.user.id))

    revalidatePath('/')
    return revalidatePath('/chat')
  }),

  readShared: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db.query.chats.findFirst({
        where: and(
          eq(chats.userId, ctx.session.user.id),
          eq(chats.id, input.id)
        ),
        with: {
          messages: true
        }
      })

      if (!chat?.sharePath) {
        return null
      }

      return chat
    }),

  share: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db.query.chats.findFirst({
        where: and(
          eq(chats.userId, ctx.session.user.id),
          eq(chats.id, input.id)
        )
      })

      if (!ctx.session.user.id || ctx.session.user.id !== chat?.userId) {
        return {
          error: 'Unauthorized'
        }
      }

      const sharePath = `/share/${input.id}`

      await ctx.db
        .update(chats)
        .set({ sharePath })
        .where(eq(chats.id, input.id))

      return sharePath
    })
})
