#!/usr/bin/env ts-node

import yargs from 'yargs'
import { build } from './build'
import { run } from './run'

const runApp = async () => {
  try {
    await build()
    await run()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

yargs
  .command('run', 'Build electron bundle and run', {
    production: {
      description: 'Run an optimized build',
      type: 'boolean',
      default: false,
    },
  }, runApp)
  .help()
  .alias('help', 'h')
  .strictCommands()
  .parse()

