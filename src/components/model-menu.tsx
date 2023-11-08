'use client'

import { type ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions'

import { useChatModel } from '~/lib/contexts/chat-model-context'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'

import { IconOpenAI } from './ui/icons'

const supportedModels: ChatCompletionCreateParamsBase['model'][] = [
  'gpt-3.5-turbo',
  'gpt-4'
]

export function ModelMenu() {
  const { model: selectedModel, setModel } = useChatModel()

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="pl-0">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
                selectedModel.startsWith('gpt-4')
                  ? 'bg-indigo-600'
                  : selectedModel.startsWith('gpt-3')
                  ? 'bg-teal-600'
                  : ''
              )}
            >
              <IconOpenAI />
            </div>
            <span className="ml-2">{selectedModel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-[180px]">
          <DropdownMenuLabel>GPT Model</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={selectedModel}
            onValueChange={setModel}
          >
            {supportedModels.map(thisModel => (
              <DropdownMenuRadioItem key={thisModel} value={thisModel}>
                {thisModel}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem asChild>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-between text-xs"
            >
              Vercel Homepage
              <IconExternalLink className="ml-auto h-3 w-3" />
            </a>
          </DropdownMenuItem> */}
          <DropdownMenuItem disabled className="text-xs text-zinc-500">
            Image Model (Coming Soon)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
