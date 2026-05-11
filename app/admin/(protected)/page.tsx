import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productCount },
    { count: categoryCount },
    { count: submissionCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Products', value: productCount ?? 0, icon: '🍩' },
    { label: 'Categories', value: categoryCount ?? 0, icon: '📂' },
    { label: 'Contact Messages', value: submissionCount ?? 0, icon: '💬' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Welcome back to XnDoughs admin.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-100">
            <p className="text-3xl mb-3">{stat.icon}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
