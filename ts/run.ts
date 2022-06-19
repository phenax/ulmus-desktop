import pathToElectron from 'electron'
import path from 'path'
import { spawn } from 'child_process'
import { fetchConfig } from './utils/config'

export const run = async () => {
  const cwd = process.cwd()
  const { outdir } = await fetchConfig(cwd, __dirname)

  const proc = spawn(pathToElectron as unknown as string, [path.join(outdir.app, 'app.js')], {
    cwd,
    stdio: 'inherit',
  })

  return new Promise(resolve => {
    proc.on('exit', _ => resolve(null))
  })
}
