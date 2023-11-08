import { type Metadata, type Viewport } from 'next'
import { Toaster } from 'react-hot-toast'

import '~/app/globals.css'

import { headers } from 'next/headers'

import { fontMono, fontSans } from '~/lib/fonts'
import { cn } from '~/lib/utils'
import { ClearHistory } from '~/components/clear-history'
import { Header } from '~/components/header'
import { Providers } from '~/components/providers'
import { Sidebar } from '~/components/sidebar'
import { SidebarFooter } from '~/components/sidebar-footer'
import { SidebarList } from '~/components/sidebar-list'
import { TailwindIndicator } from '~/components/tailwind-indicator'
import { ThemeToggle } from '~/components/theme-toggle'
import { TRPCReactProvider } from '~/trpc/react'

import { clearChats } from './actions'

export const metadata: Metadata = {
  title: {
    default: 'Next.js AI Chatbot',
    template: `%s - Next.js AI Chatbot`
  },
  description: 'An AI-powered chatbot template built with Next.js and Vercel.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  metadataBase: new URL('http://localhost:3000')
}

export const viewport: Viewport = {
  width: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          'font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <TRPCReactProvider headers={headers()}>
          <Toaster />
          <Providers attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex flex-1 flex-col bg-muted/50">
                <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
                  <Sidebar>
                    <SidebarList />
                    <SidebarFooter>
                      <ThemeToggle />
                      <ClearHistory clearChats={clearChats} />
                    </SidebarFooter>
                  </Sidebar>
                  <div className="group w-full overflow-auto pl-0 duration-300 ease-in-out animate-in peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
                    {children}
                  </div>
                </div>
              </main>
            </div>
            <TailwindIndicator />
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
