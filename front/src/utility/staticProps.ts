import { GetStaticPropsContext } from 'next'

import { getGlobal, Global } from '../api/api'

export interface PageProps {
  global: Global
}

export const getPageProps = async (context: GetStaticPropsContext): Promise<PageProps> => {
  const globalResponse = await getGlobal()
  if (globalResponse.error) throw globalResponse.error

  return { global: globalResponse.data }
}
