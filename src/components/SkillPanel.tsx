import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Skill } from '../data/skills'
import { RatingRing } from './RatingRing'

interface Props {
  skill: Skill | null
  onClose: () => void
  onStep: (direction: 1 | -1) => void
  reducedMotion: boolean
}

/** The story that opens when a skill is selected */
export function SkillPanel({ skill, onClose, onStep, reducedMotion }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!skill) return
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [skill, onClose, onStep])

  const motionProps = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 40, filter: 'blur(6px)' },
        animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, x: 40, filter: 'blur(6px)' },
      }

  return (
    <AnimatePresence mode="wait">
      {skill && (
        <motion.aside
          key={skill.id}
          className={`panel${skill.locked ? ' is-locked' : ''}`}
          role="dialog"
          aria-labelledby="panel-title"
          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          {...motionProps}
        >
          <div className="panel-top">
            <p className="panel-branch">{skill.branch}</p>
            <button ref={closeRef} type="button" className="panel-close" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="panel-hero">
            <RatingRing value={skill.rating} size={92} stroke={4} locked={skill.locked} />
            <div>
              <h2 id="panel-title">{skill.name}</h2>
              <p className="panel-scale">
                {skill.locked ? 'Still unlocking' : `Rated ${skill.rating} out of 100`}
              </p>
            </div>
          </div>

          <p className="panel-headline">{skill.headline}</p>

          <div className="panel-story">
            {skill.story.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <h3>Achievements</h3>
          <ul className="panel-evidence">
            {skill.evidence.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>

          <h3>Next level</h3>
          <p className="panel-next">{skill.nextLevel}</p>

          <div className="panel-nav">
            <button type="button" onClick={() => onStep(-1)}>
              Previous skill
            </button>
            <button type="button" onClick={() => onStep(1)}>
              Next skill
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
