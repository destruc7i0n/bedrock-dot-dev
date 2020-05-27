import React, { FunctionComponent, useState } from 'react'
import { GetStaticProps } from 'next'

import Layout from 'components/layout'
import VersionChooser from 'components/version-chooser'

import { getBedrockVersions, getTags, TagsResponse } from 'lib/files'

import { BedrockVersions } from 'lib/versions'

const DownArrow: FunctionComponent<{ click: () => void }> = ({ click }) => (
  <div className='w-full flex justify-center hover:bg-gray-100 rounded-b-lg transition transition-150 ease-in-out text-sm py-0.5 cursor-pointer' onClick={click}>
    <svg aria-hidden='true' focusable='false'
         className='w-5 h-5' xmlns='http://www.w3.org/2000/svg'
         viewBox='0 0 320 512'>
      <path fill='currentColor' d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z' />
    </svg>
  </div>
)

const Donate = () => (
  <form className='inline-block' action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>
    <input type='hidden' name='cmd' value='_donations' />
    <input type='hidden' name='business' value='9NZ66ET9MLMTN' />
    <input type='hidden' name='currency_code' value='USD' />
    <button
      className='link'
      type='submit'
      title='PayPal - The safer, easier way to pay online!'
    >
      Donate
    </button>
    <img alt='' style={{ border: 'none' }} src='https://www.paypal.com/en_CA/i/scr/pixel.gif' width='1' height='1' />
  </form>
)

type Props = {
  versions: BedrockVersions
  tags: TagsResponse
}

const IndexPage: FunctionComponent<Props> = ({ versions, tags }) => {
  const [open, setOpen] = useState(false)

  return (
    <Layout title='bedrock.dev' description='Bedrock Documentation' header={false}>
      <div className='min-h-screen bg-gray-50'>
        <div className='flex py-24 xl:py-64 xl:pb-0 flex-col justify-center items-center'>
          <div className='flex flex-col bg-white max-w-3/4 border-gray-200 rounded-lg outline-none shadow shadow-sm hover:shadow-lg appearance-none hover:border-gray-300 transition duration-150 ease-in-out rounded-lg'>
            <div className='w-full p-3 border-b border-gray-200 text-center'>
              <div className='block'>
                <span className='flex justify-center text-3xl font-extrabold'>
                  bedrock.dev
                </span>
                <span>
                  <b>Unofficial</b> Minecraft Bedrock Edition documentation
                </span>
              </div>
            </div>
            <VersionChooser versions={versions} tags={tags} />

            <div className='w-full py-2 px-3 border-t border-gray-200 text-center'>
              <div className='w-full pb-2'>
                By {' '}
                <a className='link' href='https://thedestruc7i0n.ca' target='_blank' rel='noopener noreferrer'>
                  TheDestruc7i0n
                </a>
                {' '} • {' '}
                <Donate />
              </div>

              <div className='w-full pt-2 border-t border-gray-200 text-center'>
                <a href='https://wiki.bedrock.dev/' className='link' target='_blank' rel='noopener noreferrer'>Wiki</a>
                {' '} • {' '}
                <a href='https://guide.bedrock.dev/' className='link' target='_blank' rel='noopener noreferrer'>Guide</a>
              </div>
            </div>

            {!open ? (
              <DownArrow click={() => setOpen(true)} />
            ) : (
              <div className='px-3'>
                <div className='w-full py-2 border-t border-gray-200 text-center'>
                  <a href='https://discord.gg/wAtvNQN' className='link' target='_blank' rel='noopener noreferrer'>Bedrock Scripting Discord</a>
                </div>
              </div>
            )}
          </div>
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
