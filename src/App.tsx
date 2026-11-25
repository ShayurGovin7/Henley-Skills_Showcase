import { useCallback, useEffect, useState } from 'react'
import { profile } from './data/profile'
import { skills } from './data/skills'
import { Scene } from './components/Scene'
import { SkillPanel } from './components/SkillPanel'
import { RatingRing } from './components/RatingRing'
import { useReducedMotion } from './lib/useReducedMotion'

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [indexOpen, setIndexOpen] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    document.title = profile.pageTitle
  }, [])

  const selected = skills.find((s) => s.id === selectedId) ?? null
  const handleReady = useCallback(() => setReady(true), [])
  const close = useCallback(() => setSelectedId(null), [])
  const select = useCallback((id: string) => {
    setSelectedId((cur) => (cur === id ? null : id))
    setIndexOpen(false)
  }, [])
  const step = useCallback(
    (dir: 1 | -1) =>
      setSelectedId((cur) => {
        const i = skills.findIndex((s) => s.id === cur)
        return skills[(i + dir + skills.length) % skills.length].id
      }),
    [],
  )

  return (
    <div className={`app${selected ? ' has-panel' : ''}`}>
      <Scene
        skills={skills}
        selectedId={selectedId}
        onSelect={select}
        onReady={handleReady}
        reducedMotion={reducedMotion}
      />

      <header className="identity">
        <h1>{profile.name}</h1>
        <p>{profile.role}</p>
        <p className="identity-side">{profile.sideline}</p>
      </header>

      <footer className="guide">
        <p>{profile.intro}</p>
        <div className="legend" aria-hidden="true">
          <span><RatingRing value={75} size={18} stroke={2} showValue={false} /> Rating out of 100</span>
          <span><RatingRing value={55} size={18} stroke={2} showValue={false} locked /> Still unlocking</span>
        </div>
      </footer>

      <nav className={`skill-index${indexOpen ? ' is-open' : ''}`} aria-label="All skills">
        <button type="button" className="skill-index-toggle" aria-expanded={indexOpen} onClick={() => setIndexOpen((o) => !o)}>
          {indexOpen ? 'Hide skill list' : 'Skill list'}
        </button>
        {indexOpen && (
          <ul>
            {skills.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => select(s.id)} className={s.locked ? 'is-locked' : ''}>
                  <span>{s.name}</span>
                  <span className="skill-index-rating">{s.rating}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <SkillPanel skill={selected} onClose={close} onStep={step} reducedMotion={reducedMotion} />

      <div className={`boot${ready ? ' is-done' : ''}`} aria-live="polite">
        <span>{ready ? 'Projection ready' : 'Calibrating projection'}</span>
      </div>
    </div>
  )
}
