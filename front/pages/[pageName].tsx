import { GetStaticPaths, GetStaticProps } from 'next'
import { ReactElement } from 'react'

import { getPages } from '../src/api/api'
import { Page } from '../src/components/Page'
import { getPageProps, PageProps } from '../src/utility/staticProps'

export default function OtherPage(props: PageProps): ReactElement {
  return <Page {...props} />
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: await getPageProps(context),
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pagesResponse = await getPages()
  if (pagesResponse.error) throw pagesResponse

  return {
    paths: pagesResponse.data.filter((page) => page.slug !== 'home').map((page) => `/${page.slug}`),
    fallback: false,
  }
}
