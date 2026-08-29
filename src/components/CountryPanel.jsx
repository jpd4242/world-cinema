import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CountryPanel({
  country,
  entries,
  user,
  onClose,
  onChanged
}) {
  const [showForm, setShowForm] = useState(false)

  const [mediaType, setMediaType] = useState('film')
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [notes, setNotes] = useState('')

  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!country) {
    return null
  }

  const countryEntries = entries.filter(
    entry => entry.country_code === country.code
  )

  const films = countryEntries.filter(
    entry => entry.media_type === 'film'
  )

  const tvShows = countryEntries.filter(
    entry => entry.media_type === 'tv'
  )

  async function addEntry(event) {
    event.preventDefault()

    if (!title.trim()) {
      setErrorMessage('Please enter a title.')
      return
    }

    setSaving(true)
    setErrorMessage('')

    const newEntry = {
      country_code: country.code,
      media_type: mediaType,
      title: title.trim(),
      year: year ? Number(year) : null,
      notes: notes.trim() ? notes.trim() : null,
      created_by: user.id
    }

    const { error } = await supabase
      .from('watch_entries')
      .insert(newEntry)

    setSaving(false)

    if (error) {
      console.error('SUPABASE INSERT ERROR:', error)
      setErrorMessage(error.message)
      return
    }

    setTitle('')
    setYear('')
    setNotes('')
    setShowForm(false)

    await onChanged()
  }

  async function deleteEntry(id) {
    const confirmed = window.confirm(
      'Remove this entry?'
    )

    if (!confirmed) {
      return
    }

    const { error } = await supabase
      .from('watch_entries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      setErrorMessage(error.message)
      return
    }

    await onChanged()
  }

  function Entry({ entry }) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '9px 0',
          borderBottom: '1px solid #334155'
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: '600',
              fontSize: '14px',
              wordBreak: 'break-word',
              color: '#e5e7eb'
            }}
          >
            {entry.title}

            {entry.year && (
              <span
                style={{
                  marginLeft: '6px',
                  color: '#9ca3af',
                  fontWeight: '400',
                  fontSize: '12px'
                }}
              >
                {entry.year}
              </span>
            )}
          </div>

          {entry.notes && (
            <div
              style={{
                marginTop: '3px',
                color: '#94a3b8',
                fontSize: '12px'
              }}
            >
              {entry.notes}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => deleteEntry(entry.id)}
          title="Delete"
          style={{
            flexShrink: 0,
            border: 'none',
            background: 'transparent',
            color: '#9ca3af',
            fontSize: '20px',
            lineHeight: '20px',
            cursor: 'pointer',
            padding: '0 4px'
          }}
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '90px',
        right: '30px',
        width: '360px',
        maxWidth: 'calc(100% - 60px)',
        maxHeight: 'calc(100% - 120px)',
        overflowY: 'auto',
        background: '#1e293b',
        borderRadius: '16px',
        boxShadow: '0 15px 45px rgba(0, 0, 0, 0.5)',
        border: '1px solid #475569',
        zIndex: 100,
        pointerEvents: 'auto'
      }}
    >
      <div
        style={{
          padding: '20px 20px 15px',
          borderBottom: '1px solid #334155',
          position: 'sticky',
          top: 0,
          background: '#1e293b',
          zIndex: 2
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            width: '32px',
            height: '32px',
            border: 'none',
            borderRadius: '50%',
            background: '#334155',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#e5e7eb'
          }}
        >
          ×
        </button>

        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: '#9ca3af',
            fontWeight: '600'
          }}
        >
          COUNTRY
        </div>

        <h2
          style={{
            margin: '4px 45px 0 0',
            fontSize: '24px',
            color: '#f8fafc'
          }}
        >
          {country.name}
        </h2>
      </div>

      <div style={{ padding: '15px 20px 20px' }}>
        <section>
          <h3
            style={{
              margin: '0 0 6px',
              fontSize: '15px',
              color: '#f8fafc'
            }}
          >
            🎬 Films ({films.length})
          </h3>

          {films.length === 0 ? (
            <p
              style={{
                margin: '0',
                color: '#94a3b8',
                fontSize: '13px'
              }}
            >
              No films yet.
            </p>
          ) : (
            films.map(entry => (
              <Entry key={entry.id} entry={entry} />
            ))
          )}
        </section>

        <section style={{ marginTop: '18px' }}>
          <h3
            style={{
              margin: '0 0 6px',
              fontSize: '15px',
              color: '#f8fafc'
            }}
          >
            📺 TV Shows ({tvShows.length})
          </h3>

          {tvShows.length === 0 ? (
            <p
              style={{
                margin: '0',
                color: '#94a3b8',
                fontSize: '13px'
              }}
            >
              No TV shows yet.
            </p>
          ) : (
            tvShows.map(entry => (
              <Entry key={entry.id} entry={entry} />
            ))
          )}
        </section>

        {errorMessage && (
          <div
            style={{
              marginTop: '15px',
              padding: '10px',
              background: '#451a1a',
              color: '#fca5a5',
              border: '1px solid #7f1d1d',
              borderRadius: '8px',
              fontSize: '13px'
            }}
          >
            {errorMessage}
          </div>
        )}

        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setErrorMessage('')
              setShowForm(true)
            }}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '11px',
              border: '1px dashed #475569',
              background: '#0f172a',
              borderRadius: '9px',
              cursor: 'pointer',
              fontWeight: '600',
              color: '#e5e7eb'
            }}
          >
            + Add film or TV show
          </button>
        )}

        {showForm && (
          <form
            onSubmit={addEntry}
            style={{
              marginTop: '20px',
              paddingTop: '18px',
              borderTop: '1px solid #334155'
            }}
          >
            <h3
              style={{
                margin: '0 0 12px',
                fontSize: '16px',
                color: '#f8fafc'
              }}
            >
              Add to {country.name}
            </h3>

            <div
              style={{
                display: 'flex',
                gap: '7px',
                marginBottom: '10px'
              }}
            >
              <button
                type="button"
                onClick={() => setMediaType('film')}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '8px',
                  border:
                    mediaType === 'film'
                      ? '2px solid #3b82f6'
                      : '1px solid #475569',
                  background:
                    mediaType === 'film'
                      ? '#1e3a5f'
                      : '#0f172a',
                  color: '#e5e7eb',
                  cursor: 'pointer'
                }}
              >
                🎬 Film
              </button>

              <button
                type="button"
                onClick={() => setMediaType('tv')}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '8px',
                  border:
                    mediaType === 'tv'
                      ? '2px solid #a855f7'
                      : '1px solid #475569',
                  background:
                    mediaType === 'tv'
                      ? '#3b1f5e'
                      : '#0f172a',
                  color: '#e5e7eb',
                  cursor: 'pointer'
                }}
              >
                📺 TV Show
              </button>
            </div>

            <input
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder={
                mediaType === 'film'
                  ? 'Film title'
                  : 'TV show title'
              }
              required
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: '10px',
                border: '1px solid #475569',
                background: '#0f172a',
                color: '#e5e7eb',
                borderRadius: '8px',
                marginBottom: '8px',
                fontSize: '14px'
              }}
            />

            <input
              type="number"
              min="1880"
              max="2100"
              value={year}
              onChange={event => setYear(event.target.value)}
              placeholder="Year (optional)"
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: '10px',
                border: '1px solid #475569',
                background: '#0f172a',
                color: '#e5e7eb',
                borderRadius: '8px',
                marginBottom: '8px',
                fontSize: '14px'
              }}
            />

            <textarea
              value={notes}
              onChange={event => setNotes(event.target.value)}
              placeholder="Notes (optional)"
              rows="3"
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: '10px',
                border: '1px solid #475569',
                background: '#0f172a',
                color: '#e5e7eb',
                borderRadius: '8px',
                marginBottom: '10px',
                resize: 'vertical',
                fontSize: '14px'
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setErrorMessage('')
                }}
                style={{
                  padding: '9px 14px',
                  border: '1px solid #475569',
                  background: '#334155',
                  color: '#e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '9px 16px',
                  background: '#3b82f6',
                  color: 'white',
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  cursor: saving
                    ? 'default'
                    : 'pointer'
                }}
              >
                {saving ? 'Saving...' : 'Add'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
