import axios from 'axios'

export interface Response<T> {
  data?: T
  error?: string
}

export const EXTERNAL_API_SERVER = 'https://back.benkrejci.com'
export const API_SERVER =
  process.env.NODE_ENV === 'development' ? EXTERNAL_API_SERVER : 'http://localhost:1337'

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

export interface Global {
  title: string
  socials: Social[]
}

export interface Social {
  type: 'linkedin' | 'twitter'
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
  socialInNav: boolean
  topWidgets: Widget[]
  bottomWidgets: Widget[]
  leftWidgets: Widget[]
  rightWidgets: Widget[]
}

export type Widget = ProjectGridWidget | RichTextWidget | SocialWidget | ImageWidget

export interface ProjectGridWidget {
  __component: 'widget.project-grid'
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

export const getPages = async (params?: any): Promise<Response<Page[]>> => get('pages')

export const getPage = async (
  params: { id: number } | { name: string },
): Promise<Response<Page>> => {
  const response = await getPages(params)
  return { data: response.data[0], error: response.error }
}

export interface Image extends ContentType {
  name: string
  alternativeText: string
  caption: string
  width: number
  height: number
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: 'local'
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

export interface ProjectItem extends ContentType {
  name: string
  url: string
  project: number
  description: string
}

export interface Project extends ContentType {
  name: string
  url: string
  description: string
  company: string
  cover: Image
  project_items: ProjectItem[]
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
