import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

import { Tags } from 'lib/tags'
import { VERSION } from 'lib/html/regex'

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

  try {
    const { searchParams } = new URL(req.url)
    const fileParam = searchParams.get('file')?.slice(0, 100)
    const versionParam = searchParams.get('version')

    let file = fileParam
    let version = null

    switch (versionParam?.toLowerCase()) {
      case Tags.Stable: {
        // don't show "Stable" when stable
        break
      }
      case Tags.Beta: {
        version = 'Preview'
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

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            fontFamily: '"Inter"',
          }}
        >
          <div tw='bg-gray-50 w-full h-full flex flex-col items-center justify-center'>
            <h1 tw='font-extrabold text-8xl font-bold mb-4'>bedrock.dev</h1>
            <h2 tw='font-medium text-4xl mb-2'>{!!file ? `${file} Documentation` : 'Minecraft Bedrock Edition Documentation'}</h2>
            {(file && version) && <h3 tw='text-3xl font-bold p-3 bg-blue-600 rounded-xl text-white'>{version}</h3>}
          </div>
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