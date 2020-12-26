import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'

import Layout from 'components/layout'
import Navbar from 'components/homepage/navbar'
import Footer from 'components/homepage/footer'
import HomeCard from 'components/homepage/home-card'
import VersionChooser from 'components/version-chooser/version-chooser'
import DocSearch from 'components/docsearch'

import { getTags, TagsResponse } from 'lib/tags'
import { allFilesList } from 'lib/versions'
import { transformInbound, TransformedOutbound, transformOutbound } from 'lib/bedrock-versions-transformer'
import { searchIcon } from 'components/sidebar/sidebar-filter'

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
    <Layout title='bedrock.dev' description='Minecraft Bedrock Documentation'>
      <div>
        <div className='bg-gray-50 dark:bg-dark-gray-950 border-b border-gray-200 dark:border-dark-gray-800'>
          <Navbar />

          <div className='max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 py-10 flex flex-col items-center'>
            <h1 className='font-extrabold text-4xl md:text-5xl leading-10 text-gray-900 dark:text-white'>bedrock.dev</h1>
            <h2 className='mt-4 mb-6 sm:mt-5 font-medium text-xl md:text-2xl text-center leading-tight text-gray-900 dark:text-gray-200'>
              Minecraft Bedrock Edition Documentation
            </h2>

            <div className='relative w-full rounded-full'>
              <div className='z-50 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <span className='text-gray-500 leading-4'>
                  {searchIcon}
                </span>
              </div>
              <DocSearch
                placeHolder='Search the documentation'
                staticPosition={false}
                captureForwardSlash
                className='w-full pl-8 xl:pl-7 px-4 mx-auto form-input rounded-full dark:text-gray-200 dark:bg-dark-gray-900 dark:border-dark-gray-800 leading-5'
              />
            </div>
          </div>
        </div>

        <div className='max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 mt-10'>
          <HomeCard>
            <div className='flex flex-col xl:items-center text-xl font-normal p-3'>
              <h2 className='w-full pb-3 text-xl font-bold'>
                Version Selection
              </h2>
              <VersionChooser versions={versions} tags={tags} />
            </div>
          </HomeCard>
        </div>

        <div className='mt-6'>
          <Footer />
        </div>
      </div>
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
