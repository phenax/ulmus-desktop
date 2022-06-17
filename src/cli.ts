#!/usr/bin/env ts-node

import yargs from 'yargs'
import { build } from './build'
import { run } from './run'
import { packageApp } from './package'

const runApp = async () => {
  await build()
  await run()
}

const createPackage = async () => {
  await build()
  await packageApp()
}

yargs
  .command('run', 'Build and run you app', {
    optimized: {
      description: 'Run an optimized build',
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

