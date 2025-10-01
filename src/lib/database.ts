import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only initialize Prisma if DATABASE_URL is available
let prisma: PrismaClient | null = null

if (process.env.DATABASE_URL) {
  prisma = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
}

export { prisma }

// Helper functions for JSON handling
export const serializeCancellationReasons = (reasons: string[]): string => {
  return JSON.stringify(reasons)
}

export const deserializeCancellationReasons = (reasons: string): string[] => {
  try {
    return JSON.parse(reasons)
  } catch {
    return []
  }
}
