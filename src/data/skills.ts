/**
 * SKILLS
 *
 * Every skill that orbits the hologram lives in this list. To change the site,
 * edit the text here and save. No other file needs to change.
 *
 * Fields
 *   id          a unique short name in lowercase, with no spaces (used internally)
 *   name        the label on the orbit
 *   branch      one of 'Craft', 'Builder', 'People' or 'Next branch'
 *   rating      a number from 0 to 100
 *   locked      optional; true shows the skill in amber as one you are still unlocking
 *   headline    one sentence shown under the skill name
 *   story       one or more paragraphs; each string is a paragraph
 *   evidence    your achievements for this skill, one per line
 *   nextLevel   what you will do to raise the rating
 *
 * To add a skill, copy one { ... } block, paste it before the final ], and
 * change every field. To remove one, delete its whole { ... } block.
 * The orbit spaces the skills evenly, so any number from 4 to 12 works well.
 */

export type Branch = 'Craft' | 'Builder' | 'People' | 'Next branch'

export interface Skill {
  id: string
  name: string
  branch: Branch
  rating: number
  locked?: boolean
  headline: string
  story: string[]
  evidence: string[]
  nextLevel: string
}

export const skills: Skill[] = [
  {
    id: 'datascience',
    name: 'Data science',
    branch: 'Craft',
    rating: 78,
    headline: 'I turn data into decisions people can trust.',
    story: [
      'I love the moment a messy question finally becomes clear. Most of my work is not about clever models. It is about finding the one number that truly matters to the person who has to act on it.',
      'Every project reminds me to listen first, ask better questions and only then let the data speak.',
    ],
    evidence: [
      'Deliver analysis that shapes real business decisions',
      'Selected for a data science mastery programme',
    ],
    nextLevel: 'Own a piece of work from the first question all the way to the change it creates.',
  },
  {
    id: 'dataengineering',
    name: 'Data engineering',
    branch: 'Craft',
    rating: 70,
    headline: 'I like to understand how things work underneath.',
    story: [
      'A good answer is only as strong as the data that feeds it. That is why I enjoy building the pipes, not just reading what comes out of them.',
      'When a course offered a safe practice space, I chose to set things up myself in the cloud. It was harder, and I learned far more because of it.',
    ],
    evidence: [
      'Built and ran big data workloads in the cloud',
      'Completed a hands on data engineering course',
    ],
    nextLevel: 'Build a small pipeline that runs on its own, every day, without me watching it.',
  },
  {
    id: 'rootcauses',
    name: 'Seeing beneath the surface',
    branch: 'Craft',
    rating: 74,
    headline: 'When the easy answer arrives first, I keep digging.',
    story: [
      'It is tempting to blame people or accept a quick fix. I have learned that most problems live deeper, in the patterns and systems around them.',
      'Looking underneath takes patience, but it is the difference between treating a symptom and actually helping.',
    ],
    evidence: [
      'Applied systems thinking to a real business problem',
      'Looked past quick fixes to find the root cause',
    ],
    nextLevel: 'Bring this way of thinking in early, before a solution has already been chosen.',
  },
  {
    id: 'initiative',
    name: 'Initiative',
    branch: 'Builder',
    rating: 82,
    headline: 'I would rather build it than wait for it.',
    story: [
      'When I see something that could be better, I struggle to leave it alone. I start small, learn as I go and keep moving.',
      'This showcase is a good example. I did not want another list of job titles, so I built something that shows who I am instead.',
    ],
    evidence: [
      'Turned ideas into working projects from scratch',
      'Built this holographic showcase from a single photo',
    ],
    nextLevel: 'Finish more of what I start, and share it sooner.',
  },
  {
    id: 'planning',
    name: 'Thinking ahead',
    branch: 'Builder',
    rating: 72,
    headline: 'Prove the need before you invest.',
    story: [
      'Big ideas are exciting, but I have learned to ask a quieter question first: does anyone actually need this?',
      'I test with small steps before committing time or money. It is the same instinct I bring to data work. Check the demand before you build the model.',
    ],
    evidence: [
      'Test ideas in small, safe steps before committing',
      'Plan with evidence rather than hope',
    ],
    nextLevel: 'Write down my assumptions at the start of every project and check them halfway.',
  },
  {
    id: 'connection',
    name: 'Connection',
    branch: 'People',
    rating: 88,
    headline: 'People give me energy.',
    story: [
      'I come alive in good conversation. A room feels better to me when people are talking, laughing and sharing ideas.',
      'Data work can be lonely if you let it. I want to use this gift on purpose, building the kind of trust that helps an insight truly land.',
    ],
    evidence: [
      'Build trust easily with new people',
      'Comfortable starting conversations in any room',
    ],
    nextLevel: 'Invite the people affected into my work from the very start, not only at the end.',
  },
  {
    id: 'teamwork',
    name: 'Teamwork',
    branch: 'People',
    rating: 80,
    headline: 'Nobody wins alone.',
    story: [
      'Sport taught me to know my role, trust the people around me and adjust when the plan is not working.',
      'I bring that into every project. The best results come when the whole team moves together.',
    ],
    evidence: [
      'Play team sport regularly',
      'Bring a team first mindset to every project',
    ],
    nextLevel: 'Hold a short, honest debrief after each project, the way a coach reviews a match.',
  },
  {
    id: 'curiosity',
    name: 'Learning through play',
    branch: 'People',
    rating: 76,
    headline: 'I learn best by trying, failing and trying again.',
    story: [
      'Games taught me to read a new system quickly. You learn the rules, spot the patterns and change your approach when it stops working.',
      'I want to bring more of that playful courage into my work, and worry less about getting it perfect the first time.',
    ],
    evidence: [
      'Pick up new tools and systems quickly',
      'Comfortable experimenting until something works',
    ],
    nextLevel: 'Share early versions of my work so others can shape it with me.',
  },
  {
    id: 'storytelling',
    name: 'Data storytelling',
    branch: 'Next branch',
    rating: 55,
    locked: true,
    headline: 'The skill I am growing right now.',
    story: [
      'Finding the insight is only half the job. The other half is helping people see it, feel it and act on it.',
      'This is where I am pushing myself next: telling the story behind the numbers in a way that fits the people in the room.',
    ],
    evidence: ['Named as my main growth area this year'],
    nextLevel: 'Present one piece of work as a story instead of a slide of charts, and ask for honest feedback.',
  },
]