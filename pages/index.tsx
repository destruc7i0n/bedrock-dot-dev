import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'

import Layout from 'components/layout'
import VersionChooser from 'components/version-chooser'

import { getBedrockVersions, getTags, TagsResponse } from 'lib/files'

import { BedrockVersions } from 'lib/versions'

type Props = {
  versions: BedrockVersions
  tags: TagsResponse
}

const IndexPage: FunctionComponent<Props> = ({ versions, tags }) => {
  return (
    <Layout title='bedrock.dev' description='Bedrock Documentation' header={false}>
      <div className='h-screen'>
        <div className='flex bg-gray-50 flex-col h-full justify-center items-center'>
          <VersionChooser versions={versions} tags={tags} />
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const bedrockVersions = await getBedrockVersions()
  const tags = await getTags()

  return { props: { versions: bedrockVersions, tags } }
}

export default IndexPage
