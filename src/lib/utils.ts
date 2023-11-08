import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

// export async function fetcher<JSON = unknown>(
//   input: RequestInfo,
//   init?: RequestInit
// ): Promise<JSON> {
//   const res = await fetch(input, init)

//   if (!res.ok) {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const json = await res.json()
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     if (json.error) {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
//       const error = new Error(json.error) as Error & {
//         status: number
//       }
//       error.status = res.status
//       throw error
//     } else {
//       throw new Error('An unexpected error occurred')
//     }
//   }

//   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//   return res.json()
// }

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
