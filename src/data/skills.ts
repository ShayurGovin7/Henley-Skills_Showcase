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
    name: 'Data Science',
    branch: 'Craft',
    rating: 80,
    locked: true,
    headline: 'I help people make better choices with data.',
    story: [
      'I work with data every day. My job is to find what the numbers are really saying and explain it in a way people can use.',
      'In a recent hackathon, I built a model to predict which customers would use a coupon. I kept every step short and clear so anyone could follow my thinking.',
    ],
    evidence: [
      'Work as a data scientist in banking',
      'Built a coupon prediction model in the SBSA Advance ML Hackathon',
      'Chosen for the Standard Bank Data Science Mastery Programme',
    ],
    nextLevel: 'Take one project from the first question all the way to a real change at work.',
  },

  {
    id: 'understandingpeople',
    name: 'Understanding people',
    branch: 'People',
    rating: 78,
    locked: true,
    headline: 'I try to see things the way others see them.',
    story: [
      'At Henley Business School I learned about mental models. These are the beliefs we carry that shape how we see a problem.',
      'This changed how I listen. When someone sees things another way I ask them why. I want to understand them more than I want to be right.',
    ],
    evidence: [
      'Learned about mental models at Henley Business School',
      'Ask about the reason behind a view before I reply',
    ],
    nextLevel: 'Before a big meeting I will think about how each person might see the problem.',
  },

  {
    id: 'rootcauses',
    name: 'Finding the real problem',
    branch: 'Craft',
    rating: 75,
    locked: true,
    headline: 'I do not stop at the first answer.',
    story: [
      'It is easy to blame people or go for a quick fix. Most problems run deeper than that.',
      'I take the time to look at what is really going on. That is how you fix the cause and not just the sign of it.',
    ],
    evidence: [
      'Used systems thinking on a real business problem',
      'Looked past quick fixes to find the cause',
    ],
    nextLevel: 'Look for the real problem early before anyone picks a solution.',
  },

  {
    id: 'testfirst',
    name: 'Test before I suggest',
    branch: 'Builder',
    rating: 82,
    headline: 'I prove an idea works before I ask others to use it.',
    story: [
      'When I have an idea I build a small working version first. This is called a proof of concept.',
      'It shows me quickly if the idea will work. That saves time for me and for everyone else. People can trust my ideas because I have already tried them.',
    ],
    evidence: [
      'Test ideas with a small working version before I share them',
      'Built and tested this showcase in small steps',
    ],
    nextLevel: 'Share what I learn from each test so others can learn from it too.',
  },

  {
    id: 'detail',
    name: 'Attention to detail',
    branch: 'Craft',
    rating: 80,
    locked: true,
    headline: 'I want to know how a number was made before I trust it.',
    story: [
      'When I see a score I ask how it was worked out. I look at the method behind it and how each part was weighted.',
      'Small choices in a method can change the answer a lot. Asking these questions helps me catch mistakes early and stand behind my work.',
    ],
    evidence: [
      'Compare methods to see how they differ before I choose one',
      'Check how weights and scores are worked out',
    ],
    nextLevel: 'Write down how I built each score so others can check it too.',
  },

  {
    id: 'connection',
    name: 'Connection',
    branch: 'People',
    rating: 85,
    headline: 'People give me energy.',
    story: [
      'I come alive in good conversation. A room feels better to me when people are talking, laughing and sharing ideas.',
    ],
    evidence: [
      'Build trust quickly with new people',
      'Happy to start a conversation in any room',
    ],
    nextLevel: 'Bring people into my work at the start and not only at the end.',
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
    nextLevel: 'Hold a short, honest debrief after each project. The way a coach reviews a match.',
  },

  {
    id: 'curiosity',
    name: 'Learning through play',
    branch: 'People',
    rating: 70,
    locked: true,
    headline: 'I learn by trying and trying again.',
    story: [
      'Games taught me to learn new things fast. You learn the rules and spot the patterns. When something stops working you try another way.',
      'I want to bring more of that into my work. I want to try more and worry less about getting it perfect the first time.',
    ],
    evidence: [
      'Learn new tools quickly',
      'Happy to try things until they work',
    ],
    nextLevel: 'Show others my work early so they can help shape it.',
  },

  {
    id: 'structuredthinking',
    name: 'Structured thinking',
    branch: 'Craft',
    rating: 90,
    headline: 'I break big problems into small parts.',
    story: [
      'When I face a problem I split it up. I look at what goes in and how it is worked out. Then I look at what can change and what comes out.',
      'Seeing each part on its own makes a hard problem easier to solve. It also helps me explain my thinking to others.',
    ],
    evidence: [
      'Break problems into inputs, methods, variables and outputs',
      'Write down the assumptions behind my work',
    ],
    nextLevel: 'Use this to help my team plan big pieces of work together.',
  },
]