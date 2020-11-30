import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'

import Layout from 'components/layout'
import HomeCard from '../components/home-card'
import VersionChooser from 'components/version-chooser'
import DocSearch from 'components/docsearch'

import { getTags, TagsResponse } from 'lib/tags'
import { allFilesList } from 'lib/versions'
import { transformInbound, TransformedOutbound, transformOutbound } from 'lib/bedrock-versions-transformer'

type Props = {
  bedrockVersions: TransformedOutbound
  tags: TagsResponse
}

// const Donate = () => (
//   <form className='inline-block' action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>
//     <input type='hidden' name='cmd' value='_donations' />
//     <input type='hidden' name='business' value='9NZ66ET9MLMTN' />
//     <input type='hidden' name='currency_code' value='USD' />
//     <button
//       className='link'
//       type='submit'
//     >
//       Donate
//     </button>
//     <img alt='' style={{ border: 'none' }} src='https://www.paypal.com/en_CA/i/scr/pixel.gif' width='1' height='1' />
//   </form>
// )

const IndexPage: FunctionComponent<Props> = ({ bedrockVersions, tags }) => {
  // transform to string representation
  const versions = transformInbound(bedrockVersions)

  return (
    <Layout title='bedrock.dev' description='Minecraft Bedrock Documentation' header={false}>
      <HomeCard>
        <div className='flex flex-col xl:items-center text-xl font-normal p-3 border-b border-gray-200 dark:border-dark-gray-800'>
          <DocSearch
            placeHolder='Search'
            staticPosition={false}
            captureForwardSlash={false}
            className='form-input dark:text-gray-200 dark:bg-dark-gray-900 dark:border-dark-gray-800 leading-5 w-full'
          />
        </div>
        <div className='flex flex-col xl:items-center text-xl font-normal p-3'>
          <h2 className='w-full pb-3 text-xl font-bold'>
            Version Selection
          </h2>
          <VersionChooser versions={versions} tags={tags} />
        </div>
      </HomeCard>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // transform to "compressed" version
  const bedrockVersions = transformOutbound(await allFilesList())
  const tags = await getTags()

  return { props: { bedrockVersions, tags } }
}

export default IndexPage
