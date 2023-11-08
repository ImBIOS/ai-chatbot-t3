// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { type Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '~/lib/utils'
import { CodeBlock } from '~/components/ui/codeblock'
import { IconOpenAI, IconUser } from '~/components/ui/icons'
import { ChatMessageActions } from '~/components/chat-message-actions'
import { MemoizedReactMarkdown } from '~/components/markdown'

export interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : // TODO: Can be enabled after we store model to each message in the redis database
              // : message.role === 'assistant' && model.startsWith('gpt-4')
              // ? 'bg-indigo-600'
              // : model.startsWith('gpt-3')
              // ? 'bg-teal-600'
              'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            code({ node: _node, className, children, ...props }) {
              if (typeof children === 'string' && children.length) {
                // console.log(
                //   "children.startsWith('▍')",
                //   children.startsWith('▍')
                // )
                // console.log('children[0]', children[0])
                if (children.startsWith('▍')) {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children = children.replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className ?? '')

              return match ? (
                <CodeBlock
                  key={Math.random()}
                  language={match?.[1] ?? ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}
