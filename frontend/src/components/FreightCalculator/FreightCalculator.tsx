import React, { useState, useRef, useEffect, useId } from 'react'
import { LocationSuggestion, FreightResponse } from '../../types'
import { searchLocations } from '../../services/geocoding'
import { calculateFreight, CARGO_TYPES, FREIGHT_CONFIG } from '../../services/freight'
import './FreightCalculator.css'

interface LocationState {
  label: string
  lat: number | null
  lng: number | null
}

const formatCurrency = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}min`
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}

// Autocomplete sub-component
interface AutocompleteProps {
  label: string
  placeholder: string
  value: LocationState
  onChange: (loc: LocationState) => void
}

const AutocompleteField: React.FC<AutocompleteProps> = ({ label, placeholder, value, onChange }) => {
  const id = useId()
  const query = value.label
  const [active, setActive] = useState(-1)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    onChange({ label: v, lat: null, lng: null })
    const results = searchLocations(v)
    setSuggestions(results)
    setOpen(true)
    setActive(-1)
  }

  const handleSelect = (s: LocationSuggestion) => {
    onChange({ label: s.label, lat: s.lat, lng: s.lng })
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div className="autocomplete" ref={wrapRef}>
      <label className="calc__label" htmlFor={id}>{label}</label>
      <div className="autocomplete__input-wrap">
        <svg className="autocomplete__pin" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
        </svg>
        <input
          id={id}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={`${id}-list`}
          aria-activedescendant={active >= 0 ? `${id}-option-${active}` : undefined}
          onKeyDown={e => {
            if (e.key === 'Escape') { setOpen(false); setActive(-1) }
            if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(i => Math.min(i + 1, suggestions.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
            if (e.key === 'Enter' && open && active >= 0 && suggestions[active]) { e.preventDefault(); handleSelect(suggestions[active]) }
          }}
          type="text"
          className="calc__input"
          placeholder={placeholder}
          value={query}
          onChange={handleInput}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          autoComplete="off"
        />

      </div>
      {open && query.length >= 2 && suggestions.length === 0 && <p className="field-help" role="status">Cidade fora da lista? Solicite uma cotação à equipe.</p>}
      {open && suggestions.length > 0 && (
        <ul className="autocomplete__dropdown" id={`${id}-list`} role="listbox" aria-label={label}>
          {suggestions.map((s, i) => (
            <li id={`${id}-option-${i}`} role="option" aria-selected={active === i} key={s.label} className="autocomplete__item" onMouseDown={e => { e.preventDefault(); handleSelect(s) }}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" style={{ color: 'var(--mist)', flexShrink: 0 }}>
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Main Calculator
const FreightCalculator: React.FC = () => {
  const [origin, setOrigin] = useState<LocationState>({ label: '', lat: null, lng: null })
  const [dest, setDest] = useState<LocationState>({ label: '', lat: null, lng: null })
  const [cargoType, setCargoType] = useState('perigoso')
  const [weight, setWeight] = useState<string>('1')
  const [axles, setAxles] = useState('3')
  const requestVersion = useRef(0)
  useEffect(() => () => { requestVersion.current++ }, [])
  const [result, setResult] = useState<FreightResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (origin.lat === null || origin.lng === null || dest.lat === null || dest.lng === null) {
      setError('Selecione as cidades nas sugestões. Para outras localidades, fale com nossa equipe.')
      return
    }
    setError(null)
    setLoading(true)
    setResult(null)
    const version=++requestVersion.current
    try {
      const calculated=await calculateFreight({ originLat: origin.lat, originLng: origin.lng, destLat: dest.lat, destLng: dest.lng,
        originLabel: origin.label, destLabel: dest.label, cargoType, weight: Number(weight), axles: Number(axles) })
      if (version===requestVersion.current) setResult(calculated)
    } catch (err) { if(version===requestVersion.current) { setError(err instanceof Error ? err.message : 'Não foi possível calcular.'); setResult(null) } }
    finally { if(version===requestVersion.current) setLoading(false) }
  }
  const invalidate = () => { requestVersion.current++; setLoading(false); setResult(null); setError(null) }

  const handleReset = () => {
    invalidate()
    setAxles('3')
    setResult(null)
    setOrigin({ label: '', lat: null, lng: null })
    setDest({ label: '', lat: null, lng: null })
    setWeight('1')
    setCargoType('perigoso')
    setError(null)
  }

  return (
    <section className="freight-calc" id="calculadora">
      <div className="container">
        <div className="freight-calc__header">
          <div>
            <span className="section-label">Calculadora de Frete</span>
            <h2 className="section-title">
              Simule sua rota e<br />
              <span>estime o custo</span>
            </h2>
          </div>
          <p className="section-subtitle">
            Insira origem, destino e tipo de carga para obter uma
            aproximação do frete. Para confirmar o valor exato, entre em contato com nossa equipe.
          </p>
        </div>

        <div className="freight-calc__body">
          {/* Form */}
          <div className="freight-calc__form-card">
            <form className="freight-calc__form" onSubmit={handleCalculate}>
              <div className="freight-calc__row freight-calc__row--2">
                <AutocompleteField
                  label="Cidade de Origem"
                  placeholder="Ex: São Paulo, SP"
                  value={origin}
                  onChange={v => { setOrigin(v); invalidate() }}
                />
                <AutocompleteField
                  label="Cidade de Destino"
                  placeholder="Ex: Curitiba, PR"
                  value={dest}
                  onChange={v => { setDest(v); invalidate() }}
                />
              </div>

              <div className="freight-calc__row freight-calc__row--2">
                <div className="freight-calc__field">
                  <label className="calc__label" htmlFor="cargo-type">Tipo de Carga</label>
                  <select id="cargo-type"
                    className="calc__input calc__select"
                    value={cargoType}
                    onChange={e => { setCargoType(e.target.value); invalidate() }}
                  >
                    {CARGO_TYPES.map(ct => (
                      <option key={ct.value} value={ct.value}>{ct.label}</option>
                    ))}
                  </select>
                </div>
                <div className="freight-calc__field">
                  <label className="calc__label" htmlFor="cargo-weight">Peso estimado (toneladas)</label>
                  <input
                    id="cargo-weight" type="number" required max="100"
                    className="calc__input"
                    min="0.1"
                    step="0.1"
                    value={weight}
                    onChange={e => { setWeight(e.target.value); invalidate() }}
                    placeholder="Ex: 2.5"
                  />
                </div>
              </div>

              <fieldset className="vehicle-choice">
                <legend className="calc__label">Qual caminhão você precisa?</legend>
                <div className="vehicle-choice__options">
                  {[
                    { value: '3', title: 'Caminhão menor', detail: '3 eixos' },
                    { value: '4', title: 'Caminhão maior', detail: '4 eixos' },
                  ].map(vehicle => (
                    <label className={`vehicle-choice__card ${axles === vehicle.value ? 'is-selected' : ''}`} key={vehicle.value}>
                      <input type="radio" name="truck-axles" value={vehicle.value} checked={axles === vehicle.value} onChange={e => { setAxles(e.target.value); invalidate() }} />
                      <span><strong>{vehicle.title}</strong><span>{vehicle.detail}</span></span>
                    </label>
                  ))}
                </div>
                <p className="field-help">O de 4 eixos é a opção de maior porte. Não sabe qual escolher? A equipe confirma o veículo adequado ao resíduo e ao volume.</p>
              </fieldset>
              <aside className="estimate-warning">Apenas uma aproximação. O valor exato depende da avaliação da rota, do veículo e do resíduo pela equipe comercial.</aside>
              {error && (
                <div className="freight-calc__error" role="alert">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                className={`btn-primary btn-lg freight-calc__btn ${loading ? 'loading' : ''}`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="freight-calc__btn-spinner" />
                    Calculando rota...
                  </>
                ) : (
                  <>
                    Calcular Estimativa
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </>
                )}
              </button>
              <p className="field-help">Simulação por cidade, com distância aproximada e tarifas de referência. A disponibilidade da rota depende de confirmação comercial.</p>
            </form>
          </div>

          {/* Result panel */}
          {result && (
            <div className="freight-calc__result" role="status" aria-live="polite">
              <div className="freight-calc__result-header">
                <div>
                  <span className="freight-calc__result-route">
                    {result.origin.split(',')[0]} → {result.destination.split(',')[0]}
                  </span>
                  <div className="freight-calc__result-meta">
                    <span>{result.distanceKm.toLocaleString('pt-BR')} km</span>
                    <span className="freight-calc__dot" />
                    <span>Tempo teórico de percurso: {formatDuration(result.durationMinutes)}</span>
                    <span className="freight-calc__dot" />
                    <span>{CARGO_TYPES.find(c => c.value === cargoType)?.label}</span>
                  </div>
                </div>
                <button className="freight-calc__reset" onClick={handleReset}>Nova consulta</button>
              </div>

              <p className="field-help">Composição: frete por distância e tipo de resíduo + adicional de peso + combustível + pedágios + seguro/rastreamento. Simulação de um trecho, com {result.axles} eixos.</p>
              <div className="freight-calc__breakdown">
                {[
                  { label: 'Frete base', value: result.baseValue },
                  { label: `Adicional de combustível (${FREIGHT_CONFIG.fuelSurcharge * 100}%)`, value: result.fuelSurcharge },
                  { label: 'Taxa de seguro/rastreamento (material perigoso)', value: result.hazmatFee },
                  { label: 'Estimativa de pedágio', value: result.tollEstimate },
                  ...(result.weightSurcharge > 0
                    ? [{ label: 'Adicional por peso', value: result.weightSurcharge }]
                    : []),
                ].map((line, i) => (
                  <div className="freight-calc__line" key={i}>
                    <span>{line.label}</span>
                    <span>{formatCurrency(line.value)}</span>
                  </div>
                ))}
              </div>

              <div className="freight-calc__total">
                <span>Valor aproximado</span>
                <span className="freight-calc__total-value">{formatCurrency(result.totalEstimate)}</span>
              </div>

              <p className="freight-calc__disclaimer">
                {result.routeNotice} Esta simulação é apenas uma aproximação e não é uma proposta comercial. Para confirmar o valor exato, entre em contato. O tempo não inclui paradas, restrições ou prazo de entrega.
              </p>

              <button
                className="btn-primary w-full"
                style={{ marginTop: 20 }}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('freight-quote', { detail: { origin: result.origin, destination: result.destination,
                    cargoType: CARGO_TYPES.find(c => c.value === cargoType)?.label, message: `Simulação: ${weight} t; ${result.axles} eixos; ${result.distanceKm} km aproximados; ${formatCurrency(result.totalEstimate)} (apenas aproximação). Solicito confirmação do valor exato.` } }))
                  document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Falar com a equipe para confirmar o valor exato
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FreightCalculator
