'use client'

import { useState, useEffect, useCallback } from 'react'

type Paid = { membership_type: string; notes: string | null; paid_at: string }
type Signup = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  membership_type: string
  plan_type: string | null
  payment_method: string | null
  created_at: string
  paid: Paid | null
}

export default function MembershipAdminPage() {
  const [key,       setKey]       = useState('')
  const [authed,    setAuthed]    = useState(false)
  const [authErr,   setAuthErr]   = useState('')
  const [signups,   setSignups]   = useState<Signup[]>([])
  const [loading,   setLoading]   = useState(false)
  const [modal,     setModal]     = useState<Signup | null>(null)
  const [payType,   setPayType]   = useState('')
  const [payNotes,  setPayNotes]  = useState('')
  const [saving,    setSaving]    = useState(false)
  const [filter,    setFilter]    = useState<'all'|'paid'|'unpaid'>('all')
  const [locFilter, setLocFilter] = useState('all')

  const load = useCallback(async (adminKey: string) => {
    setLoading(true)
    const res = await fetch('/api/membership-admin', {
      headers: { 'x-admin-key': adminKey },
    })
    if (res.status === 401) { setAuthed(false); setLoading(false); return }
    const data = await res.json()
    setSignups(data.signups ?? [])
    setLoading(false)
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/membership-admin', {
      headers: { 'x-admin-key': key },
    })
    if (res.status === 401) { setAuthErr('Invalid key.'); return }
    setAuthed(true)
    setAuthErr('')
    const data = await res.json()
    setSignups(data.signups ?? [])
  }

  useEffect(() => {
    if (authed) load(key)
  }, [authed, key, load])

  const openModal = (s: Signup) => {
    setModal(s)
    setPayType(s.paid?.membership_type ?? s.membership_type)
    setPayNotes(s.paid?.notes ?? '')
  }

  const markPaid = async () => {
    if (!modal) return
    setSaving(true)
    await fetch('/api/membership-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify({ signupId: modal.id, membershipType: payType, notes: payNotes }),
    })
    await load(key)
    setModal(null)
    setSaving(false)
  }

  const markUnpaid = async (signupId: string) => {
    await fetch('/api/membership-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify({ signupId, unpay: true }),
    })
    await load(key)
  }

  const displayed = signups.filter(s => {
    const paidMatch = filter === 'all' ? true : filter === 'paid' ? !!s.paid : !s.paid
    const locMatch  = locFilter === 'all' ? true : s.location === locFilter
    return paidMatch && locMatch
  })

  const paidCount   = signups.filter(s => s.paid).length
  const unpaidCount = signups.length - paidCount

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  if (!authed) {
    return (
      <main className="bg-zinc-950 text-white min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
          <h1 className="text-xl font-bold text-center mb-6">Membership Admin</h1>
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={e => setKey(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/60"
          />
          {authErr && <p className="text-red-400 text-xs text-center">{authErr}</p>}
          <button
            type="submit"
            className="w-full bg-cyan-400 text-black font-bold py-3 rounded-xl text-sm uppercase tracking-widest hover:bg-cyan-300"
          >
            Enter
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="bg-zinc-950 text-white min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold">Membership Pre-Sale</h1>
            <p className="text-zinc-500 text-sm mt-0.5">2026–2027 Season</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Chip color="zinc" label={`${signups.length} Total`} />
            <Chip color="cyan" label={`${paidCount} Paid`} />
            <Chip color="amber" label={`${unpaidCount} Pending`} />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(['all','paid','unpaid'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
                filter === f
                  ? 'bg-cyan-400 text-black'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500'
              }`}>
              {f}
            </button>
          ))}
          <div className="w-px bg-zinc-800 mx-1" />
          {(['all', 'Horsham', 'KOP', 'Rochester'] as const).map(l => (
            <button key={l} onClick={() => setLocFilter(l)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                locFilter === l
                  ? 'bg-zinc-300 text-black'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500'
              }`}>
              {l === 'all' ? 'All Locations' : l}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-600">Loading…</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">No signups found.</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block rounded-2xl border border-zinc-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900">
                    {['Name','Email','Phone','Location','Type','Plan','Payment','Signed Up','Status',''].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((s, i) => (
                    <tr key={s.id}
                      className={`border-b border-zinc-800/60 ${i % 2 === 0 ? 'bg-zinc-900/40' : 'bg-zinc-950'}`}>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">{s.first_name} {s.last_name}</td>
                      <td className="px-4 py-3 text-zinc-400">{s.email}</td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{s.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{s.location}</td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{s.membership_type}</td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{s.plan_type ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{s.payment_method ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{fmtDate(s.created_at)}</td>
                      <td className="px-4 py-3">
                        {s.paid ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Paid · {s.paid.membership_type}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {s.paid ? (
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => openModal(s)}
                              className="text-xs text-zinc-400 hover:text-white underline">Edit</button>
                            <button onClick={() => markUnpaid(s.id)}
                              className="text-xs text-red-400 hover:text-red-300 underline">Unpay</button>
                          </div>
                        ) : (
                          <button onClick={() => openModal(s)}
                            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 rounded-lg px-3 py-1.5 hover:bg-cyan-400/10 transition-colors">
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {displayed.map(s => (
                <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{s.first_name} {s.last_name}</p>
                      <p className="text-zinc-400 text-xs mt-0.5">{s.email}</p>
                      <p className="text-zinc-500 text-xs">{s.phone}</p>
                    </div>
                    {s.paid ? (
                      <span className="flex-shrink-0 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-1">
                        PAID
                      </span>
                    ) : (
                      <span className="flex-shrink-0 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-1">
                        PENDING
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                    <span>{s.location}</span>
                    <span>·</span>
                    <span>{s.membership_type}</span>
                    {s.plan_type && <><span>·</span><span className="text-zinc-400">{s.plan_type}</span></>}
                    {s.payment_method && <><span>·</span><span className="text-zinc-400">{s.payment_method}</span></>}
                    <span>·</span>
                    <span>{fmtDate(s.created_at)}</span>
                  </div>
                  {s.paid?.notes && (
                    <p className="text-xs text-zinc-500 italic">{s.paid.notes}</p>
                  )}
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => openModal(s)}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-colors">
                      {s.paid ? 'Edit Payment' : 'Mark Paid'}
                    </button>
                    {s.paid && (
                      <button onClick={() => markUnpaid(s.id)}
                        className="text-xs font-semibold py-2 px-4 rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors">
                        Unpay
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Mark Paid Modal ───────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
          onClick={() => setModal(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm space-y-4"
            onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-base">
              {modal.paid ? 'Edit Payment' : 'Mark as Paid'}
            </h2>
            <p className="text-sm text-zinc-400">
              {modal.first_name} {modal.last_name} · {modal.location}
            </p>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                Membership Type
              </label>
              <select
                value={payType}
                onChange={e => setPayType(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/60"
              >
                <option value="Full Year">Full Year</option>
                <option value="5 Month">5 Month</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                Notes <span className="text-zinc-600 font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                value={payNotes}
                onChange={e => setPayNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Paid via Venmo"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-cyan-400/60"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setModal(null)}
                className="flex-1 py-3 rounded-xl text-sm text-zinc-400 border border-zinc-700 hover:border-zinc-500 transition-colors">
                Cancel
              </button>
              <button onClick={markPaid} disabled={saving}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-cyan-400 text-black hover:bg-cyan-300 disabled:opacity-50 transition-colors">
                {saving ? 'Saving…' : modal.paid ? 'Update' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Chip({ label, color }: { label: string; color: 'zinc'|'cyan'|'amber' }) {
  const cls = {
    zinc:  'bg-zinc-800 text-zinc-300 border-zinc-700',
    cyan:  'bg-cyan-400/10 text-cyan-400 border-cyan-400/30',
    amber: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
  }[color]
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>{label}</span>
  )
}
