import { cn } from '~/lib/utils'
import { ExternalLink } from '~/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      ChatGPT may produce inaccurate information about people, places, or facts.
      <ExternalLink href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes">
        ChatGPT Latest Public Version
      </ExternalLink>
      .
    </p>
  )
}
