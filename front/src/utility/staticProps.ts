import { GetStaticPropsContext } from 'next'

import { getGlobal, getPages, Global, Page } from '../api/api'

export interface PageProps {
  global: Global
  pages: Page[]
}

export const getPageProps = async (context: GetStaticPropsContext): Promise<PageProps> => {
  const globalResponse = await getGlobal()
  if (globalResponse.error) throw globalResponse.error

  const pagesResponse = await getPages()
  if (pagesResponse.error) throw pagesResponse.error

  return { global: globalResponse.data, pages: pagesResponse.data }
}
