
import { useEffect, useState } from 'react'

import { supabase } from './lib/supabase'

import Auth from './components/Auth'

import CountryMap from './components/CountryMap'
import CountryPanel from './components/CountryPanel'
import { countries } from './data/countries'

export default function App() {

  const [session, setSession] =
    useState(null)

  const [entries, setEntries] =
    useState([])

  const [selectedCountry, setSelectedCountry] =
    useState(null)

  const [filter, setFilter] =
  useState('all')

  const [search, setSearch] =
  useState('')

  const countriesWatched =
  countries.filter(country => {
    const countryEntries =
      entries.filter(
        entry =>
          entry.country_code === country.code
      )

    return countryEntries.length > 0
  }).length

const searchResults =
  search.trim() === ''
    ? []
    : countries
        .filter(country =>
          country.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        )
        .slice(0, 8)

  const [loading, setLoading] =
    useState(true)


  /*
   * Check authentication
   */

  useEffect(() => {

    supabase.auth.getSession()
      .then(({ data }) => {

        setSession(data.session)

        setLoading(false)

      })


    const {
      data: listener
    } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {

          setSession(newSession)

        }
      )


    return () => {

      listener.subscription.unsubscribe()

    }

  }, [])


  /*
   * Load watched films / TV shows
   */

  async function loadEntries() {

    const { data, error } =
      await supabase
        .from('watch_entries')
        .select('*')
        .order('created_at', {
          ascending: true
        })


    if (error) {

      console.error(error)

      return
    }


    setEntries(data || [])
  }


  /*
   * Load entries after login
   */

  useEffect(() => {

    if (session) {
      loadEntries()
    }

  }, [session])


  /*
   * Loading screen
   */

  if (loading) {

    return (
      <div
        style={{
          padding: '40px',
          fontFamily: 'Arial'
        }}
      >
        Loading...
      </div>
    )

  }


  /*
   * Login screen
   */

  if (!session) {

    return <Auth />

  }


  /*
   * Logged-in application
   */

  return (

    <div
      style={{
        minHeight: '100vh',
        padding: '30px',
        fontFamily: 'Arial',
        background: '#0f172a'
      }}
    >

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >

          <div>

            <h1>
              🌍 World Cinema
            </h1>
            <p>
              {countriesWatched} / {countries.length} countries explored
            </p>
            <p>
              Apura's world of film and TV
            </p>

          </div>


          <button
            onClick={async () => {

              await supabase.auth.signOut()

            }}
          >
            Sign out
          </button>

        </div>
<div
  style={{
    position: 'relative',
    maxWidth: '500px',
    margin: '20px auto 12px'
  }}
>
  <input
    type="text"
    value={search}
    onChange={event =>
      setSearch(event.target.value)
    }
    placeholder="🔍 Search for a country..."
    style={{
      boxSizing: 'border-box',
      width: '100%',
      padding: '13px 16px',
      border: '1px solid #475569',
      background: '#1e293b',
      color: '#e5e7eb',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none'
    }}
  />

  {searchResults.length > 0 && (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 5px)',
        left: 0,
        right: 0,
        background: '#1e293b',
        border: '1px solid #475569',
        borderRadius: '10px',
        boxShadow:
          '0 8px 25px rgba(0,0,0,0.12)',
        overflow: 'hidden',
        zIndex: 50
      }}
    >
      {searchResults.map(country => (
        <button
          key={country.code}
          type="button"
          onClick={() => {
            setSelectedCountry(country)
            setSearch('')
          }}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            borderBottom:
              '1px solid #f3f4f6',
            background: '#1e293b',
            color: '#e5e7eb',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {country.name}
        </button>
      ))}
    </div>
  )}
</div>
<div
  style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '20px',
    marginBottom: '10px'
  }}
>
  <button
    onClick={() => setFilter('all')}
    style={{
      padding: '9px 16px',
      borderRadius: '20px',
      border: '1px solid #d1d5db',
      background:
        filter === 'all'
          ? '#172033'
          : 'white',
      color:'#e5e7eb',
      cursor: 'pointer'
    }}
  >
    All
  </button>

  <button
    onClick={() => setFilter('film')}
    style={{
      padding: '9px 16px',
      borderRadius: '20px',
      border: '1px solid #d1d5db',
      background:
        filter === 'film'
          ? '#3b82f6'
          : '#1e293b',
      color:'#e5e7eb',
      cursor: 'pointer'
    }}
  >
    🎬 Film only
  </button>

  <button
    onClick={() => setFilter('tv')}
    style={{
      padding: '9px 16px',
      borderRadius: '20px',
      border: '1px solid #d1d5db',
      background:
        filter === 'tv'
          ? '#a855f7'
          : '#1e293b',
      color:'#e5e7eb',
      cursor: 'pointer'
    }}
  >
    📺 TV only
  </button>

  <button
    onClick={() => setFilter('both')}
    style={{
      padding: '9px 16px',
      borderRadius: '20px',
      border: '1px solid #d1d5db',
      background:
        filter === 'both'
          ? '#22c55e'
          : '#1e293b',
      color:'#e5e7eb',
      cursor: 'pointer'
    }}
  >
    🎬📺 Both
  </button>
</div>
       <div
  style={{
    position: 'relative',
    background: '#1e293b',
    borderRadius: '16px',
    padding: '20px',
    marginTop: '20px',
    minHeight: '520px'
  }}
>
  <CountryMap
    entries={entries}
    selectedCountry={selectedCountry}
    setSelectedCountry={
      setSelectedCountry
    }
    filter={filter}
  />

  <CountryPanel
    country={selectedCountry}
    entries={entries}
    user={session.user}
    onClose={() =>
      setSelectedCountry(null)
    }
    onChanged={loadEntries}
  />
</div>
        

      </div>

    </div>

  )
}