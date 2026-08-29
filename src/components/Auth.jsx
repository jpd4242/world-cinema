
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [isSignUp, setIsSignUp] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const [error, setError] =
    useState('')


  async function handleSubmit(event) {

    event.preventDefault()

    setLoading(true)
    setMessage('')
    setError('')


    if (isSignUp) {

      const { error } =
        await supabase.auth.signUp({
          email: email.trim(),
          password
        })


      if (error) {
        setError(error.message)
      } else {
        setMessage(
          'Account created! Check your email if confirmation is required.'
        )
      }

    } else {

      const { error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })


      if (error) {
        setError(error.message)
      }

    }


    setLoading(false)
  }


  return (

    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        color: '#e5e7eb'
      }}
    >

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '20px',
          padding: '36px',
          boxShadow:
            '0 20px 50px rgba(0, 0, 0, 0.4)',
          boxSizing: 'border-box'
        }}
      >

        {/* Logo / title */}

        <div
          style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}
        >

          <div
            style={{
              fontSize: '48px',
              marginBottom: '8px'
            }}
          >
            🌍
          </div>

          <h1
            style={{
              margin: '0',
              color: '#f8fafc',
              fontSize: '28px',
              fontWeight: '700'
            }}
          >
            World Cinema
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              color: '#94a3b8',
              fontSize: '14px'
            }}
          >
            Apura's world of film and TV
          </p>

        </div>


        {/* Heading */}

        <h2
          style={{
            margin: '0 0 20px',
            color: '#f8fafc',
            fontSize: '20px'
          }}
        >
          {isSignUp
            ? 'Create your account'
            : 'Welcome back'}
        </h2>


        {/* Form */}

        <form onSubmit={handleSubmit}>

          <label
            style={{
              display: 'block',
              marginBottom: '7px',
              color: '#cbd5e1',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={event =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px 13px',
              borderRadius: '9px',
              border: '1px solid #475569',
              background: '#0f172a',
              color: '#f8fafc',
              fontSize: '14px',
              marginBottom: '16px',
              outline: 'none'
            }}
          />


          <label
            style={{
              display: 'block',
              marginBottom: '7px',
              color: '#cbd5e1',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={event =>
              setPassword(event.target.value)
            }
            placeholder="Your password"
            required
            minLength="6"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px 13px',
              borderRadius: '9px',
              border: '1px solid #475569',
              background: '#0f172a',
              color: '#f8fafc',
              fontSize: '14px',
              marginBottom: '18px',
              outline: 'none'
            }}
          />


          {/* Error */}

          {error && (

            <div
              style={{
                padding: '11px 12px',
                marginBottom: '15px',
                borderRadius: '9px',
                background: '#451a1a',
                border: '1px solid #7f1d1d',
                color: '#fca5a5',
                fontSize: '13px',
                lineHeight: '1.4'
              }}
            >
              {error}
            </div>

          )}


          {/* Success message */}

          {message && (

            <div
              style={{
                padding: '11px 12px',
                marginBottom: '15px',
                borderRadius: '9px',
                background: '#052e1b',
                border: '1px solid #166534',
                color: '#86efac',
                fontSize: '13px',
                lineHeight: '1.4'
              }}
            >
              {message}
            </div>

          )}


          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '9px',
              border: '1px solid #3b82f6',
              background: '#3b82f6',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading
                ? 'default'
                : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading
              ? 'Please wait...'
              : isSignUp
                ? 'Create account'
                : 'Sign in'}
          </button>

        </form>


        {/* Switch login / signup */}

        <div
          style={{
            marginTop: '22px',
            paddingTop: '20px',
            borderTop: '1px solid #334155',
            textAlign: 'center'
          }}
        >

          <span
            style={{
              color: '#94a3b8',
              fontSize: '13px'
            }}
          >
            {isSignUp
              ? 'Already have an account?'
              : "Don't have an account?"}
          </span>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setMessage('')
            }}
            style={{
              marginLeft: '6px',
              padding: '0',
              border: 'none',
              background: 'transparent',
              color: '#60a5fa',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isSignUp
              ? 'Sign in'
              : 'Create one'}
          </button>

        </div>

      </div>

    </div>
  )
}

