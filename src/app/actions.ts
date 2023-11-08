'use server'

import { api } from '~/trpc/server-invoker'

export const getChats = async () => await api.chat.readList.query()

export const getChat = async (id: string) =>
  await api.chat.readDetail.query({ id })

export const removeChat = async ({ id, path }: { id: string; path: string }) =>
  await api.chat.delete.mutate({ id, path })

export const clearChats = async () => await api.chat.deleteAll.mutate()

export const getSharedChat = async (id: string) =>
  await api.chat.readShared.query({ id })

export const shareChat = async (id: string) =>
  await api.chat.share.query({ id })
