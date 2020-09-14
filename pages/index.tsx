import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'

import Layout from 'components/layout'
import VersionChooser from 'components/version-chooser'
import ModeSelect from 'components/mode-select'
import DocSearch from 'components/docsearch'

import { getBedrockVersions} from 'lib/files'
import { getTags, TagsResponse } from 'lib/tags'
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
      <div className='min-h-screen bg-gray-50 dark:bg-dark-gray-900'>
        <div className='flex py-24 flex-col justify-center items-center'>
          <div role='main' className='flex flex-col bg-white dark:bg-dark-gray-950 text-black dark:text-gray-200 max-w-4/5 shadow dark:shadow-none rounded-lg outline-none appearance-none transition duration-150 ease-in-out rounded-lg'>
            <div className='p-3 border-b border-gray-200 dark:border-dark-gray-800 text-center'>
              <div className='flex flex-col'>
                <h1 className='text-center text-3xl font-extrabold'>
                  bedrock.dev
                </h1>
                <span>
                  <span title='Not affiliated with Mojang Studios or Microsoft' className='cursor-pointer'>
                    Unofficial
                  </span>
                  {' '}Minecraft Bedrock Edition documentation host
                </span>
              </div>
            </div>

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

            <div className='py-2 px-3 border-t border-gray-200 dark:border-dark-gray-800 text-center'>
              <div className='w-full'>
                <a href='https://wiki.bedrock.dev/' className='link' target='_blank' rel='noopener'>Wiki</a>
                {' '} • {' '}
                <a href='https://guide.bedrock.dev/' className='link' target='_blank' rel='noopener'>Guide</a>
                {' '} • {' '}
                <a href='https://github.com/destruc7i0n/bedrock-dot-dev/' className='link' target='_blank' rel='noopener'>GitHub</a>
                {' '} • {' '}
                <a href='https://discord.gg/wAtvNQN' className='link' target='_blank' rel='noopener'>Discord</a>
              </div>
            </div>

            <div className='px-3'>
              <div className='py-2 border-t border-gray-200 dark:border-dark-gray-800 text-center'>
                Website by {' '}
                <a className='link' href='https://thedestruc7i0n.ca' target='_blank' rel='noopener'>
                  TheDestruc7i0n
                </a>
                {' '} • {' '}
                <a href='https://patreon.com/destruc7i0n' className='link' target='_blank' rel='noopener'>Donate</a>
              </div>
            </div>
          </div>

          <div className='mt-2'>
            <ModeSelect />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // transform to "compressed" version
  const bedrockVersions = transformOutbound(await getBedrockVersions())
  const tags = await getTags()

  return { props: { bedrockVersions, tags } }
}

export default IndexPage
