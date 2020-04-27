import fetch from 'isomorphic-fetch'

import { BedrockVersions } from '../pages/api/docs/list'

interface ListingResponse {
  files: BedrockVersions
}

export const getBedrockVersions = async (): Promise<BedrockVersions>  => {

  // const files: ListingResponse = await (await fetch('/api/docs/list')).json()
  const files: ListingResponse = {
    "files": {
      "1.10.0.0": {
        "1.10.0.3": [
          "Addons",
          "Animations",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.10.0.7": [
          "Addons",
          "Animations",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ]
      },
      "1.11.0.0": {
        "1.11.0.1": [
          "Addons",
          "Animations",
          "Entities",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.11.0.23": [
          "Addons",
          "Animations",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.11.0.3": [
          "Addons",
          "Animations",
          "Entities",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.11.0.4": [
          "Addons",
          "Animations",
          "Entities",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.11.0.5": [
          "Addons",
          "Animations",
          "Entities",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.11.0.8": [
          "Addons",
          "Animations",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ]
      },
      "1.12.0.0": {
        "1.12.0.11": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.12.0.13": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.12.0.2": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.12.0.28": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.12.0.3": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.12.0.4": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.12.0.6": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.12.0.9": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Schemas",
          "Scripting",
          "UI"
        ]
      },
      "1.13.0.0": {
        "1.13.0.1": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Index",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.13.0.13": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.13.0.15": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.13.0.16": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.13.0.18": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.13.0.2": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.13.0.34": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.13.0.4": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.13.0.5": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.13.0.9": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.13.3.0": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ]
      },
      "1.14.0.0": {
        "1.14.0.1": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.14.0.2": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.14.0.51": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.14.0.6": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.14.0.9": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.14.1.2": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.14.1.4": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.14.2.50": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.14.20.1": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.14.30.2": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.14.30.51": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ]
      },
      "1.15.0.0": {
        "1.15.0.51": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Features",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ],
        "1.15.0.53": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Features",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ]
      },
      "1.16.0.0": {
        "1.16.0.58": [
          "Addons",
          "Animations",
          "Biomes",
          "Blocks",
          "Entities",
          "Entity Events",
          "Features",
          "Item",
          "MoLang",
          "Particles",
          "Recipes",
          "Schemas",
          "Scripting",
          "UI"
        ]
      },
      "1.8.0.0": {
        "1.8.0.0": [
          "Addons"
        ]
      },
      "1.9.0.10": {
        "1.9.0.10": [
          "Addons",
          "Animations",
          "MoLang",
          "Particles",
          "Scripting",
          "UI"
        ]
      }
    }
  }

  const bedrockVersions = files.files
  return bedrockVersions
}

export interface TagsResponse {
  stable: string[]
  beta: string[]
}

export const getTags = async (): Promise<TagsResponse> => {
  // fetch the tags from the server
  const tags = await fetch('https://raw.githubusercontent.com/bedrock-dot-dev/docs/master/tags.json')
  return await tags.json()
}
