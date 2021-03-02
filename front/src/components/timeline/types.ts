export interface TimelineCategory {
  name: string
  color: string
  contrastColor: string
}

export interface TimelineEvent {
  start: Date
  title: string
  url: string
  description: string
  category: TimelineCategory
  icon: string
}
