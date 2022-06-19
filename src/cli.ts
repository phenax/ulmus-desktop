#!/usr/bin/env ts-node

import yargs from 'yargs'
import { build } from './build'
import { run } from './run'
import { packageApp } from './package'

const command = <T>(fn: (a: T) => Promise<void>) => async (a: T) => {
  try {
    await fn(a)
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

const runApp = command(async (args: { disableDev: boolean }) => {
  await build({ devMode: !args.disableDev, optimized: args.disableDev })
  await run()
})

const createPackage = command(async ({ platform }: any) => {
  console.log(platform)
  await build({ optimized: true, devMode: false })
  await packageApp({ platform })
})

yargs
  .command('run', 'Build and run you app', {
    'disable-dev': {
      description: 'Disable development mode and run with optimized build',
      type: 'boolean',
      default: false,
    },
  }, runApp)
  .command('bundle', 'Build and package your app', {
    platform: {
      description: 'Platforms to build',
      choices: ['linux', 'win32', 'darwin'],
      type: 'array',
      defaultDescription: 'host platform'
    },
  }, createPackage)
  .help()
  .alias('help', 'h')
  .strictCommands()
  .parse()

