'use client'
import { useState } from 'react'

const FIELDS = [
  { section: 'Hero Section', fields: [
    { key: 'hero_title', label: 'Hero Title', type: 'text', placeholder: 'Crafted for Generations' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea', placeholder: 'Premium furniture handcrafted...' },
  ]},
  { section: 'About Section', fields: [
    { key: 'about_title', label: 'About Title', type: 'text', placeholder: 'Three Decades of Craftsmanship' },
    { key: 'about_text', label: 'About Text', type: 'textarea', placeholder: 'Since 1994...' },
  ]},
  { section: 'Contact Information', fields: [
    { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+91 98765 43210' },
    { key: 'email', label: 'Email Address', type: 'text', placeholder: 'info@craftura.com' },
    { key: 'address', label: 'Address', type: 'textarea', placeholder: 'Plot 42, GIDC...' },
    { key: 'whatsapp', label: 'WhatsApp Number', type: 'text', placeholder: '+919876543210' },
  ]},
]

export default function ContentEditor({ initialContent }: { initialContent: Record<string, string> }) {
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError('Failed to save. Please try again.')
      }
    } catch {
      setError('Connection error.')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm">{error}</div>}

      {FIELDS.map(section => (
        <div key={section.section} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7">
          <h2 className="font-semibold text-charcoal-700 mb-5 pb-4 border-b border-stone-100">{section.section}</h2>
          <div className="space-y-5">
            {section.fields.map(field => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-charcoal-600 mb-1.5">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    className="form-input resize-none"
                    placeholder={field.placeholder}
                    value={content[field.key] || ''}
                    onChange={e => setContent(p => ({ ...p, [field.key]: e.target.value }))}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    placeholder={field.placeholder}
                    value={content[field.key] || ''}
                    onChange={e => setContent(p => ({ ...p, [field.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 justify-end pb-8">
        {saved && (
          <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            Saved successfully!
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-7 py-2.5 bg-charcoal-800 hover:bg-charcoal-900 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</>
          ) : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
