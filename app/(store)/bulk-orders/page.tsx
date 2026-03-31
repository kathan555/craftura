'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function BulkOrdersPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
    company: '', orderType: 'B2B', notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: `Bulk Order Inquiry – ${form.company}`,
          message: `Company: ${form.company}\nAddress: ${form.address}\n\nRequirements:\n${form.notes}`,
        }),
      })
      setSubmitted(true)
    } catch (err) { console.error(err) }
    setSubmitting(false)
  }

  return (
    <div className="pt-20 bg-cream">
      {/* Hero */}
      <div className="relative bg-charcoal-900 py-24">
        <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920" alt="Office furniture" fill className="object-cover opacity-25" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block bg-wood-600 text-white text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">B2B · Bulk Orders</span>
            <h1 className="font-display text-5xl sm:text-6xl text-white mb-5 leading-tight">
              Furniture at Scale<br/>
              <em className="italic font-light text-wood-300">Without Compromise</em>
            </h1>
            <p className="text-stone-300 text-xl leading-relaxed mb-8">
              We supply hotels, corporate offices, educational institutions, and retailers with premium furniture. Consistent quality across every unit, every time.
            </p>
            <a href="#quote-form" className="btn-wood">Request a Quote</a>
          </div>
        </div>
      </div>

      {/* Clients */}
      <section className="py-16 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-stone-400 text-sm uppercase tracking-widest mb-8">Who We Serve</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🏨', title: 'Hotels & Resorts', desc: 'Room furniture, lobby pieces, restaurant sets' },
              { icon: '🏢', title: 'Corporate Offices', desc: 'Desks, cabinets, meeting room furniture' },
              { icon: '🎓', title: 'Schools & Colleges', desc: 'Library, classroom and admin furniture' },
              { icon: '🏥', title: 'Healthcare', desc: 'Ward furniture, reception, staff areas' },
            ].map(c => (
              <div key={c.title} className="text-center p-6 rounded-xl bg-stone-50 border border-stone-100">
                <div className="text-4xl mb-3">{c.icon}</div>
                <h3 className="font-semibold text-charcoal-700 mb-1">{c.title}</h3>
                <p className="text-stone-400 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-wood-500 text-xs tracking-[0.3em] uppercase font-medium mb-4">Why Craftura for Bulk</p>
            <h2 className="font-display text-4xl text-charcoal-800 mb-8">Your Ideal Manufacturing Partner</h2>
            <div className="space-y-6">
              {[
                { title: 'Consistent Quality at Scale', desc: 'Our standardized processes ensure every unit in a 500-piece order is identical to the sample you approved.' },
                { title: 'Competitive Bulk Pricing', desc: 'Volume discounts available from 20 units. Get a transparent quote with no hidden charges.' },
                { title: 'Custom Specifications', desc: 'We manufacture to your exact dimensions, material choices, and brand colors.' },
                { title: 'Dedicated Project Manager', desc: 'A single point of contact for your project, from design approval to last-mile delivery.' },
                { title: 'Phased Delivery Available', desc: 'Large projects can be delivered in phases to align with your construction timeline.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-wood-600 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-800 mb-1">{item.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800" alt="Bulk furniture" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="grid grid-cols-2 gap-4">
                {[{ v: 'MOQ 20', l: 'Minimum Order' }, { v: '60 Days', l: 'Lead Time' }].map(s => (
                  <div key={s.l} className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-white">
                    <div className="font-display text-2xl font-bold">{s.v}</div>
                    <div className="text-white/70 text-xs tracking-wider uppercase mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl text-white">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-6 relative">
            <div className="absolute top-8 left-0 right-0 h-px bg-white/10 hidden md:block" style={{margin: '0 10%'}} />
            {[
              { step: '01', title: 'Submit Inquiry', desc: 'Fill the form below with your requirements' },
              { step: '02', title: 'Consultation Call', desc: 'We discuss specifications, timeline, budget' },
              { step: '03', title: 'Sample & Approval', desc: 'Review and approve a physical sample' },
              { step: '04', title: 'Production', desc: 'Manufacturing begins with regular updates' },
              { step: '05', title: 'Delivery', desc: 'White-glove delivery and installation' },
            ].map(s => (
              <div key={s.step} className="text-center relative">
                <div className="w-14 h-14 bg-wood-600 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="font-display text-white font-bold text-sm">{s.step}</span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{s.title}</h3>
                <p className="text-stone-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="quote-form" className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-wood-500 text-xs tracking-[0.3em] uppercase font-medium mb-3">Get Started</p>
          <h2 className="font-display text-4xl text-charcoal-800">Request a Bulk Quote</h2>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-14 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l6 6 12-12" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="font-display text-2xl text-charcoal-800 mb-3">Inquiry Submitted!</h3>
            <p className="text-stone-500 mb-2">Our bulk orders team will contact you within 24 hours.</p>
            <p className="text-stone-400 text-sm">Our team will contact you shortly to confirm your order.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-charcoal-700 mb-1.5">Contact Name *</label>
                  <input type="text" required className="form-input" placeholder="Your name"
                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal-700 mb-1.5">Company / Organisation *</label>
                  <input type="text" required className="form-input" placeholder="Hotel Grand, TechCorp..."
                    value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-charcoal-700 mb-1.5">Phone *</label>
                  <input type="tel" required className="form-input" placeholder="+91 98765 43210"
                    value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal-700 mb-1.5">Email *</label>
                  <input type="email" required className="form-input" placeholder="procurement@company.com"
                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1.5">Delivery Address</label>
                <input type="text" className="form-input" placeholder="Project/delivery location"
                  value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal-700 mb-1.5">Project Requirements *</label>
                <textarea required rows={6} className="form-input resize-none"
                  placeholder="Describe your requirements: types of furniture, approximate quantities, materials, timeline, budget range, any special requirements..."
                  value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <button type="submit" disabled={submitting} className="btn-wood w-full text-base py-4">
                {submitting ? 'Submitting...' : 'Submit Bulk Inquiry'}
              </button>
              <p className="text-center text-xs text-stone-400">We'll respond within 24 hours with a detailed quote</p>
            </form>
          </div>
        )}
      </section>
    </div>
  )
}
