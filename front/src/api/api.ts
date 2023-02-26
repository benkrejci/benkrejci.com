import axios from 'axios'

import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { IconName } from '../icons/Icon'
import { Project } from '../components/widgets/Project'

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

export interface ApiGlobal {
  title: string
  socials: Social[]
  topNav: ApiPage[]
}

export const fromApiGlobal = (global: ApiGlobal) => ({
  ...global,
  topNav: fromApiPages(global.topNav),
})

export type Global = ReturnType<typeof fromApiGlobal>

export interface Social {
  type: IconName
  url: string
}

export interface ApiContentType {
  id: number
  published_at?: string
  created_at: string
  updated_at: string
}

export type ContentType<T> = T & {
  published_at: Date
  created_at: Date
  updated_at: Date
}

const fromApiContentTypeObj = (obj) => ({
  ...obj,
  published_at: obj.published_at ? new Date(obj.published_at) : undefined,
  created_at: obj.created_at ? new Date(obj.created_at) : undefined,
  updated_at: obj.updated_at ? new Date(obj.updated_at) : undefined,
})

export interface ApiPage extends ApiContentType {
  title: string
  slug: string
  description?: string
  hideSocial: boolean
  hideSocialDown: Breakpoint | null
  hideSocialUp: Breakpoint | null
  topWidgets: ApiWidget[]
  bottomWidgets: ApiWidget[]
  leftWidgets: ApiWidget[]
  rightWidgets: ApiWidget[]
}

export const fromApiPages = (pages: ApiPage[]): ContentType<ApiPage>[] =>
  pages.map((page) => ({
    ...fromApiContentTypeObj(page),
    bottomWidgets: fromApiWidgets(page.bottomWidgets),
    leftWidgets: fromApiWidgets(page.leftWidgets),
    rightWidgets: fromApiWidgets(page.rightWidgets),
    topWidgets: fromApiWidgets(page.topWidgets),
  }))

export type Page = ReturnType<typeof fromApiPages>

export const getPage = async (
  params: { id: number } | { name: string },
): Promise<Response<ApiPage>> => {
  const response = await getPages(params)
  return { data: response.data[0], error: response.error }
}

export const getPages = async (
  params?: any,
  preview: boolean = false,
): Promise<Response<ApiPage[]>> => {
  const response = await get<ApiPage[]>('pages', params)
  return {
    ...response,
    data: response.data && (await mapPages(response.data)),
  }
}

const mapPages = (pages: ApiPage[]): Promise<ApiPage[]> =>
  Promise.all(
    pages.map(
      async (page): Promise<ApiPage> => ({
        ...page,
        topWidgets: await mapWidgets(page.topWidgets),
        bottomWidgets: await mapWidgets(page.bottomWidgets),
        leftWidgets: await mapWidgets(page.leftWidgets),
        rightWidgets: await mapWidgets(page.rightWidgets),
      }),
    ),
  )

export type ApiWidget =
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
  projects: ApiProject[]
}

export interface ProjectListWidget {
  __component: 'widget.project-list'
  id: number
  projects: ApiProject[]
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
  image: ApiFile
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
  icon: IconName
  title: string
  category: string
  url: string
  description: string
}

export const getGlobal = async (): Promise<Response<ApiGlobal>> => {
  const response = await get<ApiGlobal>('global')
  return {
    ...response,
    data: {
      ...response.data,
      topNav: response.data && (await mapPages(response.data.topNav)),
    },
  }
}

const mapWidgets = (widgets: ApiWidget[]): Promise<ApiWidget[]> =>
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

const fromApiWidget = (widget: ApiWidget): ContentType<ApiWidget> => {
  switch (widget.__component) {
    case 'widget.project-list':
      return {
        ...fromApiContentTypeObj(widget),
        projects: widget.projects.map((project) => fromApiContentTypeObj(project)),
      }
    default:
      return fromApiContentTypeObj(widget)
  }
}

const fromApiWidgets = (widgets: ApiWidget[]) => widgets.map(fromApiWidget)

export type Widget = ReturnType<typeof fromApiWidget>

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

export type ApiFile = ApiContentType &
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

export type File = ContentType<ApiFile>

export interface ApiProject extends ApiContentType {
  name: string
  url: string
  description: string
  cover: ApiFile
  links?: ProjectLink[]
}

export type Project = ContentType<ApiProject>

export interface ProjectLink {
  label: string
  url: string
  icon: IconName
}

export const getProjectUri = (project: ApiProject) => `/portfolio/${toSlug(project.name)}`

export const getProjects = (params?: any): Promise<Response<ApiProject[]>> =>
  get<ApiProject[]>('projects', { ...params })

export const getProject = async (
  params: { id: number } | { name: string },
): Promise<Response<ApiProject>> => {
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
