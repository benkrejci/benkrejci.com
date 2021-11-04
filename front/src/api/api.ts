import axios from 'axios'

import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

export interface Response<T> {
  data?: T
  error?: string
}

export const EXTERNAL_API_SERVER = process.env.NEXT_PUBLIC_BACK_EXTERNAL_URL
if (!EXTERNAL_API_SERVER)
  throw Error(
    'No NEXT_PUBLIC_BACK_EXTERNAL_API_SERVER env variable, please run `yarn setup:dev` or `yarn setup` to initialize default env variables',
  )
const IS_CLIENT = typeof window !== 'undefined'
export const API_SERVER =
  IS_CLIENT || process.env.NODE_ENV === 'development'
    ? EXTERNAL_API_SERVER
    : `http://localhost:${process.env.BACK_PORT}`

export const toSlug = (name: string) => encodeURIComponent(name.replace(/ /g, '-'))
export const fromSlug = (slug: string) => decodeURIComponent(slug).replace(/-/g, ' ')

export async function get<T>(uri: string, params?: any): Promise<Response<T>> {
  try {
    const response = await axios.get(`${API_SERVER}/${uri}`, { params })
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

export interface Social {
  type: string
  url: string
}

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
  image: File
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

export const getGlobal = async (): Promise<Response<Global>> => {
  const response = await get<Global>('global')
  return {
    ...response,
    data: {
      ...response.data,
      topNav: await mapPages(response.data.topNav),
    },
  }
}

export const getPages = async (
  params?: any,
  preview: boolean = false,
): Promise<Response<Page[]>> => {
  const response = await get<Page[]>('pages', params)
  return {
    ...response,
    data: await mapPages(response.data),
  }
}

const mapPages = (pages: Page[]): Promise<Page[]> =>
  Promise.all(
    pages.map(
      async (page): Promise<Page> => ({
        ...page,
        topWidgets: await mapWidgets(page.topWidgets),
        bottomWidgets: await mapWidgets(page.bottomWidgets),
        leftWidgets: await mapWidgets(page.leftWidgets),
        rightWidgets: await mapWidgets(page.rightWidgets),
      }),
    ),
  )

const mapWidgets = (widgets: Widget[]): Promise<Widget[]> =>
  Promise.all(
    widgets.map(async (widget) => {
      switch (widget.__component) {
        case 'widget.project-list':
          return {
            ...widget,
            projects: (
              await getProjects({
                id_in: widget.projects.map((project) => project.id),
              })
            ).data,
          }
        default:
          return widget
      }
    }),
  )

export const getPage = async (
  params: { id: number } | { name: string },
): Promise<Response<Page>> => {
  const response = await getPages(params)
  return { data: response.data[0], error: response.error }
}

export interface Image {
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

export type File = ContentType &
  Partial<Image> & {
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

export interface Project extends ContentType {
  name: string
  url: string
  description: string
  cover: File
  links?: ProjectLink[]
}

export interface ProjectLink {
  label: string
  url: string
  icon: string
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
