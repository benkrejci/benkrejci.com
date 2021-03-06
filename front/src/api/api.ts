import axios from 'axios'

import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

export interface Response<T> {
  data?: T
  error?: string
}

export const EXTERNAL_API_SERVER = 'https://back.benkrejci.com'
const IS_CLIENT = typeof window !== 'undefined'
export const API_SERVER =
  IS_CLIENT || process.env.NODE_ENV === 'development'
    ? EXTERNAL_API_SERVER
    : 'http://localhost:1339'

export const toSlug = (name: string) => encodeURIComponent(name.replace(/ /g, '-'))
export const fromSlug = (slug: string) => decodeURIComponent(slug).replace(/-/g, ' ')

export async function get<T>(uri: string, params?: any): Promise<Response<T>> {
  try {
    const response = await axios.get(`${API_SERVER}/${uri}`, { params })
    //console.log(JSON.stringify(response.data, null, 2))
    return { data: response.data }
  } catch (error) {
    return { error }
  }
}

export async function post<T>(uri: string, data?: any): Promise<Response<T>> {
  try {
    const response = await axios.post(`${API_SERVER}/${uri}`, data)
    return { data: response.data }
  } catch (error) {
    return { error }
  }
}

export interface Global {
  title: string
  socials: Social[]
  topNav: Page[]
}

export type SocialType = 'linkedin' | 'twitter' | 'instagram' | 'soundcloud'

export interface Social {
  type: SocialType
  url: string
}

export const getGlobal = async (): Promise<Response<Global>> => get('global')

export interface ContentType {
  id: number
  published_at?: Date
  created_at: Date
  updated_at: Date
}

export interface Page extends ContentType {
  title: string
  slug: string
  description?: string
  hideSocialDown: Breakpoint | null
  hideSocialUp: Breakpoint | null
  topWidgets: Widget[]
  bottomWidgets: Widget[]
  leftWidgets: Widget[]
  rightWidgets: Widget[]
}

export type Widget =
  | ProjectGridWidget
  | ProjectListWidget
  | RichTextWidget
  | SocialWidget
  | ImageWidget
  | TimelineWidget
  | ContactWidget

export interface ProjectGridWidget {
  __component: 'widget.project-grid'
  id: number
  projects: Project[]
}

export interface ProjectListWidget {
  __component: 'widget.project-list'
  id: number
  projects: Project[]
}

export interface RichTextWidget {
  __component: 'widget.rich-text'
  id: number
  content: string
  paper: boolean
}

export interface SocialWidget {
  __component: 'widget.social'
  id: number
  title: string
  paper: boolean
}

export interface ImageWidget {
  __component: 'widget.image'
  id: number
  image: Image
  align: 'left' | 'center' | 'right'
}

export interface ContactWidget {
  __component: 'widget.contact-form'
  id: number
}

export interface TimelineWidget {
  __component: 'widget.timeline'
  id: number
  description: string
  timelineEvents: TimelineEvent[]
}

export interface TimelineEvent {
  id: number
  start: string
  icon: string
  title: string
  category: string
  url: string
  description: string
}

export const getPages = async (params?: any): Promise<Response<Page[]>> => get('pages')

export const getPage = async (
  params: { id: number } | { name: string },
): Promise<Response<Page>> => {
  const response = await getPages(params)
  return { data: response.data[0], error: response.error }
}

export interface File extends ContentType {
  name: string
  alternativeText: string
  hash: string
  mime: string
  url: string
  previewUrl: string | null
  ext: string
  size: number
  provider: 'local'
}

export interface Image extends File {
  caption: string
  width: number
  height: number
  formats: {
    [key in 'thumbnail' | 'small']: {
      name: string
      hash: string
      ext: string
      mime: string
      width: number
      height: number
      size: number
      path: string | null
      url: string
    }
  }
}

export interface Project extends ContentType {
  name: string
  url: string
  description: string
  company: string
  cover: Image
  project_items: ProjectItem[]
}

export interface ProjectItem extends ContentType {
  name: string
  url: string
  project: number
  description: string
}

export const getProjectUri = (project: Project) => `/portfolio/${toSlug(project.name)}`

export const getProjects = async (params?: any): Promise<Response<Project[]>> =>
  get('projects', { ...params })

export const getProject = async (
  params: { id: number } | { name: string },
): Promise<Response<Project>> => {
  const response = await getProjects(params)
  return { data: response.data[0], error: response.error }
}

export interface Contact {
  name: string
  email: string
  subject: string
  message: string
}

export const submitContact = (contact: Contact) => post('contacts', contact)
