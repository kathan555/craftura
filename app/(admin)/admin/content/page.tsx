import { prisma } from '@/lib/prisma'
import ContentEditor from '@/components/admin/ContentEditor'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Site Content | Admin' }

export default async function AdminContentPage() {
  const contents = await prisma.siteContent.findMany({ orderBy: { key: 'asc' } })
  const contentMap = Object.fromEntries(contents.map(c => [c.key, c.value]))
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-charcoal-800">Site Content</h1>
        <p className="text-stone-400 text-sm mt-1">Edit homepage and contact information</p>
      </div>
      <ContentEditor initialContent={contentMap} />
    </div>
  )
}
