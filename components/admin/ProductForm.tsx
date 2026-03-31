'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Category { id: string; name: string }

interface ProductFormData {
  name: string; description: string; categoryId: string
  dimensions: string; material: string; price: string; moq: string
  featured: boolean; inStock: boolean
  images: { url: string; altText: string }[]
}

interface Props {
  categories: Category[]
  initialData?: Partial<ProductFormData> & { id?: string }
  mode: 'create' | 'edit'
}

export default function ProductForm({ categories, initialData, mode }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    categoryId: initialData?.categoryId || (categories[0]?.id || ''),
    dimensions: initialData?.dimensions || '',
    material: initialData?.material || '',
    price: initialData?.price || '',
    moq: initialData?.moq || '',
    featured: initialData?.featured || false,
    inStock: initialData?.inStock !== undefined ? initialData.inStock : true,
    images: initialData?.images || [{ url: '', altText: '' }],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const setField = (k: keyof ProductFormData, v: any) => setForm(p => ({ ...p, [k]: v }))

  const addImage = () => setField('images', [...form.images, { url: '', altText: '' }])
  const removeImage = (i: number) => setField('images', form.images.filter((_, j) => j !== i))
  const updateImage = (i: number, field: 'url' | 'altText', val: string) => {
    const imgs = [...form.images]
    imgs[i] = { ...imgs[i], [field]: val }
    setField('images', imgs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        price: form.price ? parseFloat(form.price) : null,
        moq: form.moq ? parseInt(form.moq) : null,
        images: form.images.filter(img => img.url.trim()),
      }

      const url = mode === 'create' ? '/api/products' : `/api/products/${initialData?.id}`
      const method = mode === 'create' ? 'POST' : 'PATCH'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save product')
      } else {
        router.push('/admin/products')
        router.refresh()
      }
    } catch (err) {
      setError('Something went wrong')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm">{error}</div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7">
        <h2 className="font-semibold text-charcoal-700 mb-5">Basic Information</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1.5">Product Name *</label>
            <input type="text" required className="form-input" placeholder="e.g. Artisan Oak Sofa"
              value={form.name} onChange={e => setField('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1.5">Description *</label>
            <textarea required rows={4} className="form-input resize-none"
              placeholder="Describe the product..."
              value={form.description} onChange={e => setField('description', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1.5">Category *</label>
            <select required className="form-input"
              value={form.categoryId} onChange={e => setField('categoryId', e.target.value)}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7">
        <h2 className="font-semibold text-charcoal-700 mb-5">Specifications</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1.5">Dimensions</label>
            <input type="text" className="form-input" placeholder="W120 x D60 x H76 cm"
              value={form.dimensions} onChange={e => setField('dimensions', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1.5">Material</label>
            <input type="text" className="form-input" placeholder="Solid Teak Wood"
              value={form.material} onChange={e => setField('material', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1.5">Price (₹)</label>
            <input type="number" className="form-input" placeholder="45000"
              value={form.price} onChange={e => setField('price', e.target.value)} />
            <p className="text-xs text-stone-400 mt-1">Leave blank to show "Price on request"</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal-600 mb-1.5">Minimum Order Qty (B2B)</label>
            <input type="number" className="form-input" placeholder="10"
              value={form.moq} onChange={e => setField('moq', e.target.value)} />
          </div>
        </div>
        <div className="flex gap-6 mt-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-stone-300 text-wood-600 focus:ring-wood-500"
              checked={form.featured} onChange={e => setField('featured', e.target.checked)} />
            <span className="text-sm text-charcoal-700">Featured Product</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-stone-300 text-wood-600 focus:ring-wood-500"
              checked={form.inStock} onChange={e => setField('inStock', e.target.checked)} />
            <span className="text-sm text-charcoal-700">In Stock</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-charcoal-700">Product Images</h2>
          <button type="button" onClick={addImage}
            className="text-xs text-wood-600 hover:text-wood-700 font-medium flex items-center gap-1">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Add Image
          </button>
        </div>
        <div className="space-y-4">
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 space-y-2">
                <input type="url" className="form-input text-sm" placeholder="https://... (image URL)"
                  value={img.url} onChange={e => updateImage(i, 'url', e.target.value)} />
                <input type="text" className="form-input text-sm" placeholder="Alt text"
                  value={img.altText} onChange={e => updateImage(i, 'altText', e.target.value)} />
              </div>
              {img.url && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                  <Image src={img.url} alt={img.altText || 'Preview'} fill className="object-cover"
                    onError={() => {}} />
                </div>
              )}
              {form.images.length > 1 && (
                <button type="button" onClick={() => removeImage(i)}
                  className="p-2 text-stone-300 hover:text-red-500 transition-colors mt-1">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 mt-3">First image will be used as primary / thumbnail</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 justify-end">
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 text-stone-600 hover:text-charcoal-800 text-sm font-medium transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="px-7 py-2.5 bg-charcoal-800 hover:bg-charcoal-900 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60">
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{mode === 'create' ? 'Creating...' : 'Saving...'}</>
          ) : (
            mode === 'create' ? 'Create Product' : 'Save Changes'
          )}
        </button>
      </div>
    </form>
  )
}
