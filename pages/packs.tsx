import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'

import S3 from 'aws-sdk/clients/s3'

import Log from '../lib/log'

import Layout from 'components/layout'
import HomeCard from 'components/home-card'

type Props = {
  versions: PackVersions
}

const getUrl = (folder: string, id: string) => {
  return ['https://void.bedrock.dev', folder, `${id}.zip`].join('/')
}

const PacksPage: FunctionComponent<Props> = ({ versions }) => {
  return (
    <Layout title='Packs | bedrock.dev' description='Minecraft Bedrock Default Packs' header={false}>
      <HomeCard>
        <div className='p-3'>
          <h2 className='w-full pb-3 text-xl font-bold'>
            Default Packs Archive
          </h2>

          <div className='home-container max-h-96 overflow-y-auto flex flex-wrap xl:items-center font-normal'>
            {Object.keys(versions).reverse().map((v, i) => (
              <div className='w-1/2' key={`packs-versions-${i}`}>
                <div className='m-1 text-center bg-gray-50 dark:bg-dark-gray-900 border border-gray-200 dark:border-dark-gray-800 p-2 rounded-md'>
                  <p className='text-lg'>{v}</p>
                  <div className='flex flex-row'>
                    {versions[v][0] && (
                      <div className='w-1/2'>
                        <a href={getUrl('behaviours', v)} className='link pr-2' target='_blank' download rel='noopener'>Behaviour</a>
                      </div>
                    )}
                    {versions[v][1] && (
                      <div className='w-1/2'>
                        <a href={getUrl('behaviours', v)} className='link pl-2' target='_blank' download rel='noopener'>Resource</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </HomeCard>
    </Layout>
  )
}

type PackVersions = {
  [key: string]: [boolean, boolean]
}

export const getStaticProps: GetStaticProps = async () => {
  const s3 = new S3({
    'accessKeyId': process.env.AWS_ACCESS_KEY_ID_BEDROCK,
    'secretAccessKey': process.env.AWS_SECRET_ACCESS_KEY_BEDROCK,
    'region': 'us-east-1',
  })

  let versions: PackVersions = {}
  let paths: string[] = []

  try {
    const objects = await s3.listObjectsV2({ Bucket: process.env.AWS_BUCKET_NAME_BEDROCK || '' }).promise()
    if (objects.Contents)
      paths = objects.Contents.filter(c => c.Key && c.Key?.endsWith('.zip')).map(c => c.Key!)
  } catch (e) {
    Log.error('Could not list items from bucket!')
  }

  for (let path of paths) {
    const [ folder, name ] = path.split('/')
    if (folder && name) {
      const version = name.replace('.zip', '')
      if (!versions[version]) versions[version] = [false, false]
      if (folder === 'behaviours') versions[version][0] = true
      if (folder === 'resources') versions[version][1] = true
    }
  }

  return { props: { versions } }
}

export default PacksPage
