import React, { FunctionComponent, useState } from 'react'
import { GetStaticProps } from 'next'

import Layout from 'components/layout'
import VersionChooser from 'components/version-chooser'

import { getBedrockVersions, getTags, TagsResponse } from 'lib/files'
import { transformInbound, TransformedOutbound, transformOutbound } from 'lib/bedrock-versions-transformer'

const DownArrow: FunctionComponent<{ click: () => void }> = ({ click }) => (
  <div className='w-full flex justify-center hover:bg-gray-100 rounded-b-lg transition transition-150 ease-in-out text-sm py-0.5 cursor-pointer' onClick={click}>
    <svg aria-hidden='true' focusable='false'
         className='w-5 h-5' xmlns='http://www.w3.org/2000/svg'
         viewBox='0 0 320 512'>
      <path fill='currentColor' d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z' />
    </svg>
  </div>
)

type Props = {
  bedrockVersions: TransformedOutbound
  tags: TagsResponse
}

const IndexPage: FunctionComponent<Props> = ({ bedrockVersions, tags }) => {
  const [open, setOpen] = useState(false)

  // transform to string representation
  const versions = transformInbound(bedrockVersions)

  return (
    <Layout title='bedrock.dev' description='Minecraft Bedrock Documentation' header={false}>
      <div className='min-h-screen bg-gray-50'>
        <div className='flex py-24 flex-col justify-center items-center'>
          <div role='main' className='flex flex-col bg-white max-w-3/4 shadow shadow-sm rounded-lg outline-none appearance-none transition duration-150 ease-in-out rounded-lg'>
            <div className='p-3 border-b border-gray-200 text-center'>
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

            <VersionChooser versions={versions} tags={tags} />

            <div className='py-2 px-3 border-t border-gray-200 text-center'>
              <div className='w-full'>
                <a href='https://wiki.bedrock.dev/' className='link' target='_blank' rel='noopener noreferrer'>Wiki</a>
                {' '} • {' '}
                <a href='https://guide.bedrock.dev/' className='link' target='_blank' rel='noopener noreferrer'>Guide</a>
                {' '} • {' '}
                <a href='https://github.com/destruc7i0n/bedrock-dot-dev/' className='link' target='_blank' rel='noopener noreferrer'>GitHub</a>
              </div>
            </div>

            {!open ? (
              <DownArrow click={() => setOpen(true)} />
            ) : (
              <div className='px-3'>
                <div className='py-2 border-t border-gray-200 text-center'>
                  <a href='https://discord.gg/wAtvNQN' className='link' target='_blank' rel='noopener noreferrer'>Bedrock Scripting Discord</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='w-full border-t border-gray-200 text-center'>
        <div className='pt-3 bottom-safe-area-inset inset-3'>
          Website By {' '}
          <a className='link' href='https://thedestruc7i0n.ca' target='_blank' rel='noopener noreferrer'>
            TheDestruc7i0n
          </a>
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
