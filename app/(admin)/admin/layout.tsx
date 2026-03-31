import { getAdminSession } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession()

  if (!admin) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-charcoal-900 overflow-hidden">
      <AdminSidebar admin={admin} />
      <main className="flex-1 overflow-y-auto bg-stone-50">
        {children}
      </main>
    </div>
  )
}