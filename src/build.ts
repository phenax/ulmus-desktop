import path from 'path'
import { promises as fs } from 'fs'
import { bundle } from './utils/build'
import { fetchConfig } from './utils/config'

export const build = async () => {
  const cwd = process.cwd()
  const appSrc = path.join(__dirname, 'app-src')

  const config = await fetchConfig(cwd, appSrc)
  const dist = config.outdir
  const distRenderer = path.join(config.outdir, 'renderer')

  await Promise.all([
    bundle({
      entryPoint: path.join(appSrc, 'app.ts'),
      cwd: config.root,
      outdir: dist,
      platform: 'node',
      format: 'cjs',
      define: {
        'process.env.MAIN': JSON.stringify(config.paths.main),
        'process.env.PUBLIC_DIR': JSON.stringify(distRenderer),
      },
    }),
    bundle({
      entryPoint: path.join(appSrc, 'renderer.ts'),
      cwd: config.root,
      outdir: distRenderer,
      define: {
        'process.env.MAIN': JSON.stringify(config.paths.renderer),
      },
    }),
    bundle({
      cwd: config.root,
      entryPoint: path.join(appSrc, 'preload.ts'),
      outdir: distRenderer,
    }),
  ])

  const copySrc = (from: string, to: string) =>
    fs.copyFile(path.join(appSrc, from), path.join(distRenderer, to));

  await Promise.all([
    copySrc('index.html', 'index.html'),
  ])
}
