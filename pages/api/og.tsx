import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

import cn from 'classnames'

import { getTags, Tags } from 'lib/tags'
import { VERSION } from 'lib/html/regex'
import { Locale } from 'lib/i18n'

// i18next does not work as well on the server, so we have to use a different method to get the strings
import trans from 'public/locales/en/common.json'

export const config = {
  runtime: 'experimental-edge',
}

export default async function (req: NextRequest) {
  const [fontData, fontMediumData, fontBoldData] = await Promise.all([
    fetch(new URL('../../styles/fonts/Inter/inter-latin-ext-400-normal.woff', import.meta.url)).then(
      (res) => res.arrayBuffer(),
    ),
    fetch(new URL('../../styles/fonts/Inter/inter-latin-ext-500-normal.woff', import.meta.url)).then(
      (res) => res.arrayBuffer(),
    ),
    fetch(new URL('../../styles/fonts/Inter/inter-latin-ext-700-normal.woff', import.meta.url)).then(
      (res) => res.arrayBuffer(),
    ),
  ])

  const tags = await getTags(Locale.English)

  try {
    const { searchParams } = new URL(req.url)
    const fileParam = searchParams.get('file')?.slice(0, 100) ?? ''
    const versionParam = searchParams.get('version')

    let file = fileParam
    let version = null
    let taggedVersion = null

    switch (versionParam) {
      case Tags.Stable: {
        version = trans['component']['version_chooser']['stable_string']
        taggedVersion = tags.stable[1]
        break
      }
      case Tags.Beta: {
        version = trans['component']['version_chooser']['beta_string']
        taggedVersion = tags.beta[1]
        break
      }
      default: {
        if (versionParam !== null) {
          if (versionParam?.match(VERSION)) {
            version = versionParam
          } else {
            return new Response('Invalid version', { status: 400 })
          }
        }
        break
      }
    }

    const docsPageLayout = (
      <div tw='bg-gray-50 w-full h-full flex flex-col justify-center pl-16'>
        <h2 tw='font-bold text-4xl font-bold text-gray-500 mb-0'>bedrock.dev</h2>
        <h1 tw='font-extrabold mb-0 text-9xl ml-0'>{file}</h1>
        <h2 tw='text-5xl font-medium mt-2'>
          {trans['page']['docs']['website_title_tagged_stable'].replace('{{title}} ', '')}
        </h2>
        <div tw='flex flex-row'>
          {(file && version) && (
            <h3 tw={cn(
              'text-4xl p-2 rounded-xl',
              { 'bg-yellow-400 text-black': versionParam === Tags.Beta, 'bg-blue-600 text-white': versionParam !== Tags.Beta }
            )}>{version}</h3>)}
          {taggedVersion && <h3 tw='ml-4 text-4xl p-2 bg-gray-200 rounded-xl'>{taggedVersion}</h3>}
        </div>
      </div>
    )

    const defaultLayout = (
      <div tw='bg-gray-50 w-full h-full flex flex-col justify-center pl-16'>
        <h1 tw='font-extrabold text-9xl'>
          bedrock.dev
        </h1>
        <h2 tw='font-medium text-4xl'>{trans['page']['home']['subtitle']}</h2>
      </div>
    )

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            fontFamily: '"Inter"',
            backgroundColor: 'white',
          }}
        >
          {file ? docsPageLayout : defaultLayout}
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: fontMediumData,
            weight: 500,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: fontBoldData,
            weight: 700,
            style: 'normal',
          }
        ],
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}