import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(event) {
    event.preventDefault()

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f0f0'
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          width: '400px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}
      >
        <h1>🌍 World Cinema</h1>

        <p>Login</p>

        <form onSubmit={handleLogin}>

          <div>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={event =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={event =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <br />

          {error && (
            <p style={{ color: 'red' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Signing in...'
              : 'Log in'}
          </button>

        </form>
      </div>
    </div>
  )
}