import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'

import Layout from 'components/layout'
import VersionChooser from 'components/version-chooser'

import { getBedrockVersions} from 'lib/files'
import { getTags, TagsResponse } from 'lib/tags'
import { transformInbound, TransformedOutbound, transformOutbound } from 'lib/bedrock-versions-transformer'

type Props = {
  bedrockVersions: TransformedOutbound
  tags: TagsResponse
}

const IndexPage: FunctionComponent<Props> = ({ bedrockVersions, tags }) => {
  // transform to string representation
  const versions = transformInbound(bedrockVersions)

  return (
    <Layout title='bedrock.dev' description='Minecraft Bedrock Documentation' header={false}>
      <div className='min-h-screen bg-gray-50'>
        <div className='flex py-24 flex-col justify-center items-center'>
          <div role='main' className='flex flex-col bg-white max-w-4/5 shadow shadow-sm rounded-lg outline-none appearance-none transition duration-150 ease-in-out rounded-lg'>
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
                {' '} • {' '}
                <a href='https://discord.gg/wAtvNQN' className='link' target='_blank' rel='noopener noreferrer'>Discord</a>
              </div>
            </div>

            <div className='px-3'>
              <div className='py-2 border-t border-gray-200 text-center'>
                Website By {' '}
                <a className='link' href='https://thedestruc7i0n.ca' target='_blank' rel='noopener noreferrer'>
                  TheDestruc7i0n
                </a>
              </div>
            </div>
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
