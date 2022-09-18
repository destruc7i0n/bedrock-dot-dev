import React, { FunctionComponent, useState } from 'react'
import { GetStaticProps } from 'next'

import { useTranslation, Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { ArrowDownTrayIcon } from '@heroicons/react/20/solid'

import S3 from 'aws-sdk/clients/s3'

import Log from '../lib/log'
import { compareBedrockVersions } from '../lib/util'
import { getLocale } from '../lib/i18n'

import Layout from 'components/layout'
import Navbar from 'components/homepage/navbar'
import Footer from 'components/footer'

const getUrl = (folder: string, id: string) => {
  return ['https://void.bedrock.dev', folder, `${id}.zip`].join('/')
}

type PackCardProps = {
  version: string
  versions: PackVersions
}

const PackCard: FunctionComponent<PackCardProps> = ({ version, versions }) => {
  const { t } = useTranslation('common')

  const [open, setOpen] = useState(false)

  const links = (
    <>
      {versions[version][0] ? (
        <a href={getUrl('behaviours', version)} className='link' download>{t('component.packs_page.behaviours_link')}</a>
      ) : (
        <p className='text-gray-500 dark:text-gray-400'>{t('component.packs_page.behaviours_link')}</p>
      )}

      {versions[version][1] ? (
        <a href={getUrl('resources', version)} className='link' target='_blank' download rel='noopener'>{t('component.packs_page.resources_link')}</a>
      ) : (
        <p className='text-gray-500 dark:text-gray-400'>{t('component.packs_page.resources_link')}</p>
      )}
    </>
  )

  return (
    <div className='text-center bg-gray-50 dark:bg-dark-gray-950 border border-gray-200 dark:border-transparent p-2 rounded-md'>
      <p className='text-lg dark:text-gray-200'>{version}</p>
      <div className='flex flex-col w-full md:flex-row md:justify-around items-center justify-center'>
        {open ? links : <span className='link cursor-pointer' onClick={() => setOpen(!open)}><ArrowDownTrayIcon className='pointer-events-none w-6 h-6' /></span>}
      </div>
    </div>
  )
}

type PacksPageProps = {
  versions: PackVersions
}

const PacksPage: FunctionComponent<PacksPageProps> = ({ versions }) => {
  const { t } = useTranslation('common')
  const ordered = Object.keys(versions).sort(compareBedrockVersions)

  return (
    <Layout title={`${t('page.packs.website_title')} | bedrock.dev`} description={t('page.packs.website_description')}>
      <div className='h-screen'>
        <Navbar />

        <div className='max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 mt-8 mb-10'>
          <div className='max-w-screen-lg mx-auto space-y-4'>
            <h4 className='text-4xl font-bold text-black dark:text-gray-200'>{t('page.packs.title')}</h4>
            <p className='text-lg text-black dark:text-gray-200'>
              <Trans i18nKey='page.packs.subtitle' t={t} components={[<a className='link' href='https://github.com/bedrock-dot-dev/packs' target='_blank' />]} />
            </p>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 font-normal'>
              {ordered.map((v, i) => <PackCard key={`packs-versions-${i}`} version={v} versions={versions} />)}
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

export const getStaticProps: GetStaticProps = async ({ locale: localeVal }) => {
  const locale = getLocale(localeVal)

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

  return { props: { versions, ...await serverSideTranslations(locale, ['common']) } }
}

export default PacksPage
