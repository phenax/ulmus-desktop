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
        'process.env.JS_MODULE': JSON.stringify(config.paths['js:main'] || ''),
      },
    }),
    bundle({
      entryPoint: path.join(appSrc, 'renderer.ts'),
      cwd: config.root,
      outdir: distRenderer,
      define: {
        'process.env.MAIN': JSON.stringify(config.paths.renderer),
        'process.env.JS_MODULE': JSON.stringify(config.paths['js:renderer'] || ''),
      },
    }),
    bundle({
      cwd: config.root,
      entryPoint: path.join(appSrc, 'preload.ts'),
      outdir: dist,
    }),
  ])

  const copyToPublic = (from: string, to: string) =>
    fs.copyFile(from, path.join(distRenderer, to));

  await Promise.all([
    copyToPublic(path.join(appSrc, config.paths.html || 'index.html'), 'index.html'),
    config.paths.assetsDir && fs.cp(
      path.join(appSrc, config.paths.assetsDir),
      distRenderer,
      { recursive: true, force: true },
    ),
  ])
}
