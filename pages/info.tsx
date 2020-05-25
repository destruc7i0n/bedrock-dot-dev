import React from 'react'

import Layout from 'components/layout'

const Info = () => (
  <Layout title='Info'>
    <div className='p-5'>
      <h3 className='text-bold text-lg mb-2'>About</h3>
      <p className='my-4'>
        An <b>unofficial</b> Minecraft Bedrock Edition documentation website hosted by <a href='https://thedestruc7i0n.ca' className='link'>TheDestruc7i0n</a>.
      </p>

      <h3 className='text-bold text-lg mt-2'>Links</h3>
      <p className='my-4'>
        Latest beta entities, etc.: <a className='link' href='https://bedrock.dev/b/Entities' target='_blank' rel='noopener noreferrer'>https://bedrock.dev/b/Entities</a>
        <br />
        Latest release entities, etc.: <a className='link' href='https://bedrock.dev/r/Entities' target='_blank' rel='noopener noreferrer'>https://bedrock.dev/r/Entities</a>
      </p>

      <h3 className='text-bold text-lg mt-2'>Discord</h3>
      <p className='my-4'>
        Interested in joining a Discord with players who are knowledgeable with Scripting and Addons?
        {' '}
        <a className='link' href='https://discord.gg/wAtvNQN' target='_blank' rel='noopener noreferrer'>Click here</a>
      </p>

      <h3 className='text-bold text-lg mt-2'>Donations</h3>
      <p className='flex flex-col my-4'>
        <form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>
          <input type='hidden' name='cmd' value='_donations' />
          <input type='hidden' name='business' value='9NZ66ET9MLMTN' />
          <input type='hidden' name='currency_code' value='USD' />
          <input type='image' src='https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif' style={{ border: 'none' }} name='submit' title='PayPal - The safer, easier way to pay online!' alt='Donate with PayPal button' />
          <img alt='' style={{ border: 'none' }} src='https://www.paypal.com/en_CA/i/scr/pixel.gif' width='1' height='1' />
        </form>
      </p>
    </div>
  </Layout>
)

export default Info
