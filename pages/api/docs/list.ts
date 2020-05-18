import { NextApiRequest, NextApiResponse } from 'next'

import { allFilesList } from 'lib/versions'

export default async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const files = await allFilesList()
    res.status(200).json({
      files
    })
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}
