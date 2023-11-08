'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

import { cn } from '~/lib/utils'
import { Button, type ButtonProps } from '~/components/ui/button'
import { IconDiscord, IconSpinner } from '~/components/ui/icons'

interface LoginButtonProps extends ButtonProps {
  showDiscordIcon?: boolean
  text?: string
}

export function LoginButton({
  text = 'Login with Discord',
  showDiscordIcon = true,
  className,
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Button
      variant="outline"
      onClick={async () => {
        setIsLoading(true)
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        await signIn('discord', { callbackUrl: `/` })
      }}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : showDiscordIcon ? (
        <IconDiscord className="mr-2" />
      ) : null}
      {text}
    </Button>
  )
}
