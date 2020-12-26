import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'

import S3 from 'aws-sdk/clients/s3'

import Log from '../lib/log'
import { compareBedrockVersions } from '../lib/util'

import Layout from 'components/layout'
import Navbar from 'components/homepage/navbar'
import Footer from 'components/homepage/footer'

type Props = {
  versions: PackVersions
}

const getUrl = (folder: string, id: string) => {
  return ['https://void.bedrock.dev', folder, `${id}.zip`].join('/')
}

const PacksPage: FunctionComponent<Props> = ({ versions }) => {
  const ordered = Object.keys(versions).sort(compareBedrockVersions)

  return (
    <Layout title='Packs | bedrock.dev' description='Minecraft Bedrock Template Behavior and Resource Packs archive'>
      <div className='h-screen'>
        <Navbar />

        <div className='max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 mt-8 mb-10'>
          <div className='max-w-screen-lg mx-auto'>
            <h4 className='text-4xl font-bold text-black dark:text-gray-200'>Template Packs Archive</h4>
            <p className='mt-4 text-lg text-black dark:text-gray-200'>This is an archive of the default template packs provided by Mojang.</p>

            <div className='-mx-4 mt-4 flex flex-wrap xl:items-center font-normal'>
              {ordered.map((v, i) => (
                <div className='w-1/2 md:w-1/3 lg:w-1/4' key={`packs-versions-${i}`}>
                  <div className='m-4 text-center bg-gray-50 dark:bg-dark-gray-950 border border-gray-200 dark:border-transparent p-2 rounded-md'>
                    <p className='text-lg dark:text-gray-200'>{v}</p>
                    <div className='flex flex-col md:flex-row'>
                      <div className='w-full md:w-1/2'>
                        {versions[v][0] ? (
                          <a href={getUrl('behaviours', v)} className='link md:pr-2' download>Behaviours</a>
                        ) : (
                          <p className='md:pr-2 text-gray-500 dark:text-gray-400'>Behaviours</p>
                        )}
                      </div>
                      <div className='w-full md:w-1/2'>
                        {versions[v][1] ? (
                          <a href={getUrl('resources', v)} className='link md:pl-2' target='_blank' download rel='noopener'>Resources</a>
                        ) : (
                          <p className='md:pl-2 text-gray-500 dark:text-gray-400'>Resources</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <Footer dark />
        </div>
      </div>
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
