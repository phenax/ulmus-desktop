#!/usr/bin/env ts-node

import yargs from 'yargs'
import { build } from './build'
import { run } from './run'
import { packageApp } from './package'

const runApp = async (args: any) => {
  await build({ devMode: !args.disableDev, optimized: args.disableDev })
  await run()
  process.exit(0)
}

const createPackage = async () => {
  await build({ optimized: true, devMode: false })
  await packageApp()
}

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
      description: 'Platforms to build for - linux, win32, darwin',
      type: 'array',
    },
  }, createPackage)
  .help()
  .alias('help', 'h')
  .strictCommands()
  .parse()

