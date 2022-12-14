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

// yes, all these need to be inlined
const ASSETS = {
  'addons': [
    new URL('assets/og/addons/addons_1.png', import.meta.url),
  ],
  'animations': [
    new URL('assets/og/animations/animations_1.png', import.meta.url),
  ],
  'biomes': [
    new URL('assets/og/biomes/biomes_1.png', import.meta.url),
  ],
  'blocks': [
    new URL('assets/og/blocks/blocks_1.png', import.meta.url),
  ],
  'entities': [
    new URL('assets/og/entities/entities_1.png', import.meta.url),
    new URL('assets/og/entities/entities_2.png', import.meta.url),
    new URL('assets/og/entities/entities_3.png', import.meta.url),
  ],
  'entity_events': [
    new URL('assets/og/entity_events/entity_events_1.png', import.meta.url),
  ],
  'entity_timeline_events': [
    new URL('assets/og/entity_timeline_events/entity_timeline_events_1.png', import.meta.url),
  ],
  'features': [
    new URL('assets/og/features/features_1.png', import.meta.url),
  ],
  'item': [
    new URL('assets/og/item/item_1.png', import.meta.url),
    new URL('assets/og/item/item_2.png', import.meta.url),
    new URL('assets/og/item/item_3.png', import.meta.url),
  ],
  'molang': [
    new URL('assets/og/molang/molang_1.png', import.meta.url),
  ],
  'particles': [
    new URL('assets/og/particles/particles_1.png', import.meta.url),
  ],
  'recipes': [
    new URL('assets/og/recipes/recipes_1.png', import.meta.url),
  ],
  'schemas': [
    new URL('assets/og/schemas/schemas_1.png', import.meta.url),
  ],
}

const getAsset = async (file: string): Promise<string | null> => {
  const name = file.toLowerCase().replace(/ /g, '_') as keyof typeof ASSETS
  if (!ASSETS.hasOwnProperty(name)) return null

  const assets = ASSETS[name];
  const index = Math.floor(Math.random() * assets.length)

  const arrayBuffer = await fetch(assets[index]).then(
    (res) => res.arrayBuffer(),
  )
  return 'data:image/png;base64,' + btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
}

export default async function (req: NextRequest) {
  const [fontData, fontMediumData, fontBoldData] = await Promise.all([
    fetch(new URL('styles/fonts/Inter/inter-latin-ext-400-normal.woff', import.meta.url)).then(
      (res) => res.arrayBuffer(),
    ),
    fetch(new URL('styles/fonts/Inter/inter-latin-ext-500-normal.woff', import.meta.url)).then(
      (res) => res.arrayBuffer(),
    ),
    fetch(new URL('styles/fonts/Inter/inter-latin-ext-700-normal.woff', import.meta.url)).then(
      (res) => res.arrayBuffer(),
    ),
  ])

  const tags = await getTags(Locale.English)

  try {
    const { searchParams } = new URL(req.url)
    const fileParam = searchParams.get('file')?.slice(0, 100) ?? ''
    const versionParam = searchParams.get('version')

    let file = fileParam
    let taggedVersion = null
    let version = null

    switch (versionParam) {
      case Tags.Stable: {
        taggedVersion = Tags.Stable
        version = tags.stable[1]
        break
      }
      case Tags.Beta: {
        taggedVersion = Tags.Beta
        version = tags.beta[1]
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

    const asset = await getAsset(fileParam)

    const bgColorMap = { 'bg-yellow-500': taggedVersion === Tags.Beta, 'bg-blue-600': versionParam !== Tags.Beta }

    const docsPageLayout = (
      <div tw='bg-gray-50 flex flex-row w-full h-full pl-16'>
        <div tw={cn('absolute bottom-0 left-0 min-w-screen h-1', bgColorMap)} style={{
          boxShadow: `0 0 35px 5px ${taggedVersion === Tags.Beta ? 'rgba(234, 179, 8, 0.6)' : 'rgba(37, 99, 235, 0.6)'}`,
        }} />
        <div tw='flex flex-col justify-center h-full w-[70%]'>
          <h2 tw='font-bold text-4xl font-bold text-gray-500 mb-0'>bedrock.dev</h2>
          <h1 tw={cn('font-extrabold mb-0 ml-0', { 'text-9xl': file.length < 16, 'text-8xl': file.length >= 16 })}>{file}</h1>
          <h2 tw='text-5xl font-medium mt-2'>
            {trans['page']['docs']['website_title_tagged_stable'].replace('{{title}} ', '')}
          </h2>
          <div tw='flex flex-row'>
            {taggedVersion && (
              <h3 tw={cn(
                'text-4xl p-2 px-4 mr-4 rounded-xl text-white',
                bgColorMap
              )}>{trans['component']['version_chooser'][`${taggedVersion}_string`]}</h3>)}

            {version && <h3 tw='text-4xl p-2 px-4 bg-gray-200 rounded-xl'>{version}</h3>}
          </div>
        </div>
        {asset && (
          <div tw='flex flex-1 h-full items-center'>
            <img src={asset} width={256} height={256} />
          </div>
        )}
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
        debug: false,
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