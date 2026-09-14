export type Route = { category: string; department: string; priority: 'low' | 'medium' | 'high' | 'urgent'; confidence: number }

type Rule = { category: string; department: string; keywords: string[]; priority?: Route['priority'] }

const rules: Rule[] = [
  { category: 'IT & Technology', department: 'IT Support', keywords: ['wifi','wi-fi','internet','network','computer','laptop','software','login','password','portal','printer'], priority: 'high' },
  { category: 'Hostel', department: 'Hostel', keywords: ['hostel','room','warden','mess','food','water','accommodation','bed'], priority: 'high' },
  { category: 'Library', department: 'Library', keywords: ['library','book','books','librarian','reading room','borrow','issue book'], priority: 'medium' },
  { category: 'Facilities', department: 'Facilities', keywords: ['electricity','fan','light','lift','elevator','washroom','toilet','cleaning','maintenance','classroom','furniture'], priority: 'high' },
  { category: 'Academic', department: 'Academic', keywords: ['exam','marks','result','attendance','faculty','teacher','course','class','timetable','assignment'], priority: 'medium' },
  { category: 'Administration', department: 'Administration', keywords: ['certificate','document','fee','scholarship','office','id card','administration','admission'], priority: 'medium' },
]

export function routeComplaint(title: string, description: string): Route {
  const text = `${title} ${description}`.toLowerCase()
  let best: { rule: Rule; score: number } | null = null
  for (const rule of rules) {
    const score = rule.keywords.reduce((sum, keyword) => sum + (text.includes(keyword) ? 1 : 0), 0)
    if (score && (!best || score > best.score)) best = { rule, score }
  }
  if (!best) return { category: 'General', department: 'Administration', priority: 'medium', confidence: 0.35 }
  const confidence = Math.min(0.98, 0.55 + best.score * 0.12)
  return { category: best.rule.category, department: best.rule.department, priority: best.rule.priority ?? 'medium', confidence }
}
