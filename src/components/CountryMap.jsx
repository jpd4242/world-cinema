
import {
  ComposableMap,
  Geographies,
  Geography
} from 'react-simple-maps'

import { countries } from '../data/countries'


const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'


function getCountryStatus(countryCode, entries) {

  const countryEntries =
    entries.filter(
      entry =>
        entry.country_code === countryCode
    )

  const hasFilm =
    countryEntries.some(
      entry =>
        entry.media_type === 'film'
    )

  const hasTV =
    countryEntries.some(
      entry =>
        entry.media_type === 'tv'
    )


  if (hasFilm && hasTV) {
    return 'both'
  }

  if (hasFilm) {
    return 'film'
  }

  if (hasTV) {
    return 'tv'
  }

  return 'neither'
}


function getColour(status) {

  switch (status) {

    case 'film':
      return '#3b82f6'

    case 'tv':
      return '#a855f7'

    case 'both':
      return '#22c55e'

    case 'neither':
      return '#475569'

    default:
      return '#475569'
  }
}


export default function CountryMap({
  entries,
  selectedCountry,
  setSelectedCountry,
  filter
}) {

  return (

    <div
      style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto'
      }}
    >

      <ComposableMap
        style={{
          width: '100%',
          height: 'auto',
          position: 'relative',
          zIndex: 1
        }}
      >

        <Geographies geography={GEO_URL}>

          {({ geographies }) =>

            geographies.map(geo => {

              /*
               * world-atlas uses numeric ISO
               * country codes.
               */

              const numericId =
                String(geo.id)
                  .padStart(3, '0')


              const country =
                countries.find(
                  item =>
                    item.numeric === numericId
                )


              /*
               * If this geography isn't part of
               * our tracked country list, render it
               * as a neutral territory.
               *
               * It still participates in the visual
               * filter rather than becoming white.
               */

              if (!country) {

                return (

                  <Geography
                    key={geo.rsmKey}
                    geography={geo}

                    style={{
                      default: {
                        fill: '#334155',
                        stroke: '#64748b',
                        strokeWidth: 0.5,
                        outline: 'none'
                      },

                      hover: {
                        fill: '#475569',
                        stroke: '#94a3b8',
                        strokeWidth: 0.7,
                        outline: 'none'
                      },

                      pressed: {
                        fill: '#475569',
                        outline: 'none'
                      }
                    }}
                  />

                )

              }


              /*
               * Determine whether this country has
               * films, TV, or both.
               */

              const status =
                getCountryStatus(
                  country.code,
                  entries
                )


              /*
               * Determine whether it belongs to
               * the currently selected filter.
               */

              const visible =
                filter === 'all' ||
                status === filter


              const selected =
                selectedCountry?.code ===
                country.code


              /*
               * Countries that don't match the
               * selected filter become very faint,
               * rather than white.
               */

              if (!visible) {

                return (

                  <Geography
                    key={geo.rsmKey}
                    geography={geo}

                    onClick={() =>
                      setSelectedCountry(country)
                    }

                    style={{
                      default: {
                        fill: '#334155',
                        stroke: '#475569',
                        strokeWidth: 0.3,
                        opacity: 0.25,
                        outline: 'none'
                      },

                      hover: {
                        fill: '#475569',
                        stroke: '#64748b',
                        strokeWidth: 0.5,
                        opacity: 0.5,
                        outline: 'none',
                        cursor: 'pointer'
                      },

                      pressed: {
                        fill: '#475569',
                        opacity: 0.5,
                        outline: 'none'
                      }
                    }}
                  />

                )

              }


              /*
               * Normal visible country.
               */

              return (

                <Geography
                  key={geo.rsmKey}
                  geography={geo}

                  onClick={() =>
                    setSelectedCountry(country)
                  }

                  style={{

                    default: {
                      fill:
                        getColour(status),

                      stroke: '#cbd5e1',

                      strokeWidth:
                        selected
                          ? 1.5
                          : 0.5,

                      outline: 'none',

                      cursor: 'pointer'
                    },

                    hover: {
                      fill: '#f59e0b',

                      stroke: '#ffffff',

                      strokeWidth: 1,

                      outline: 'none',

                      cursor: 'pointer'
                    },

                    pressed: {
                      fill: '#ea580c',

                      outline: 'none'
                    }

                  }}

                />

              )

            })

          }

        </Geographies>

      </ComposableMap>

    </div>

  )
}

