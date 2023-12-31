'use client'

import { useChat, type Message } from 'ai/react'
import { toast } from 'react-hot-toast'

import {
  ChatModelProvider,
  useChatModel
} from '~/lib/contexts/chat-model-context'
import { cn } from '~/lib/utils'
import { ChatList } from '~/components/chat-list'
import { ChatPanel } from '~/components/chat-panel'
import { ChatScrollAnchor } from '~/components/chat-scroll-anchor'
import { EmptyScreen } from '~/components/empty-screen'

// const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

function ChatChild({ id, initialMessages, className }: ChatProps) {
  // const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
  //   'ai-token',
  //   null
  // )
  // const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  // const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')

  const { model } = useChatModel()
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        // previewToken
        model
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      }
    })
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      {/* <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  )
}

export const Chat = (props: ChatProps) => {
  return (
    <ChatModelProvider>
      <ChatChild {...props} />
    </ChatModelProvider>
  )
}
