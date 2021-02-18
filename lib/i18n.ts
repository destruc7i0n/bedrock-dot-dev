export enum Locale {
  English = 'en',
  Chinese = 'zh',
}

type RepositoryData = {
  [key in Locale]: {
    name: string
    tag: string
  }
}

const REPOSITORIES: RepositoryData = {
  [Locale.English]: {
    name: 'bedrock-dot-dev/docs',
    tag: 'master',
  },
  [Locale.Chinese]: {
    name: 'MiemieMethod/addons-docs',
    tag: 'originid',
  },
}

export const getLocale = (locale?: string): Locale => {
  switch (locale) {
    case 'zh': return Locale.Chinese
    default: return Locale.English
  }
}

export const getRepository = (locale: Locale) => {
  if (Object.keys(REPOSITORIES).includes(locale)) return REPOSITORIES[locale]
  return REPOSITORIES[Locale.English]
}
