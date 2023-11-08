'use client'

import { createContext, useContext, useState } from 'react'
import { type ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions'

type ChatModelContextType = {
  model: ChatCompletionCreateParamsBase['model']
  setModel: (model: ChatModelContextType['model']) => void
}

const ChatModelContext = createContext<ChatModelContextType | undefined>(
  undefined
)

export const useChatModel = (): ChatModelContextType => {
  const context = useContext(ChatModelContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

export const ChatModelProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [model, setModel] =
    useState<ChatModelContextType['model']>('gpt-3.5-turbo')

  return (
    <ChatModelContext.Provider value={{ model, setModel }}>
      {children}
    </ChatModelContext.Provider>
  )
}
