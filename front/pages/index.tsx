import { GetStaticProps } from 'next'
import { ReactElement } from 'react'

import { Page } from '../src/components/Page'
import { getPageProps, PageProps } from '../src/utility/staticProps'

export default function Index(props: PageProps): ReactElement {
  return <Page {...props} />
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: await getPageProps(context),
  }
}
