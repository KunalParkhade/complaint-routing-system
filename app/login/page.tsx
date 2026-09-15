'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false)
  async function submit(event: FormEvent){event.preventDefault();setError('');setLoading(true);const {error}=await supabase.auth.signInWithPassword({email,password});setLoading(false);if(error)return setError(error.message);router.push('/dashboard');router.refresh()}
  return <main className="auth-shell"><section className="auth-card"><a href="/" className="back-link">← CRS 2.0</a><div className="brand-mark">CRS</div><p className="eyebrow">COMPLAINT ROUTING SYSTEM</p><h1>Welcome back.</h1><p className="muted">Apni complaint submit aur track karne ke liye sign in karein.</p><form onSubmit={submit} className="stack"><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required /></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" required /></label>{error&&<div className="error-box">{error}</div>}<button className="primary-button" disabled={loading}>{loading?'Signing in…':'Sign in →'}</button></form><p className="auth-footer">New here? <Link href="/register">Create an account</Link></p></section></main>
}
