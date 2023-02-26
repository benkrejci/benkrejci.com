import { GetStaticPropsContext } from 'next'

import { getGlobal, ApiGlobal } from '../api/api'

export interface PageProps {
  global: ApiGlobal
  preview: boolean
}

export const getPageProps = async (context: GetStaticPropsContext): Promise<PageProps> => {
  const globalResponse = await getGlobal()
  if (globalResponse.error) throw globalResponse.error

  return { global: globalResponse.data, preview: !!context.preview }
}
