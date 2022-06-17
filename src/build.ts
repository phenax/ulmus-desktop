import path from 'path'
import { promises as fs } from 'fs'
import { bundle } from './utils/build'
import { fetchConfig } from './utils/config'
import { pick } from 'ramda'

export const build = async () => {
  const cwd = process.cwd()
  const appSrc = path.join(__dirname, 'app-src')

  const { config, outdir } = await fetchConfig(cwd, appSrc)

  await Promise.all([
    bundle({
      entryPoint: path.join(appSrc, 'app.ts'),
      cwd: config.root,
      outdir: outdir.app,
      platform: 'node',
      format: 'cjs',
      define: {
        'process.env.MAIN': JSON.stringify(config.paths.main),
        'process.env.PUBLIC_DIR': JSON.stringify(outdir.renderer),
        'process.env.JS_MODULE': JSON.stringify(config.paths['js:main'] || ''),
      },
    }),
    bundle({
      entryPoint: path.join(appSrc, 'renderer.ts'),
      cwd: config.root,
      outdir: outdir.renderer,
      define: {
        'process.env.MAIN': JSON.stringify(config.paths.renderer),
        'process.env.JS_MODULE': JSON.stringify(config.paths['js:renderer'] || ''),
      },
    }),
    bundle({
      cwd: config.root,
      entryPoint: path.join(appSrc, 'preload.ts'),
      outdir: outdir.app,
    }),
  ])

  const copyToPublic = (from: string, to: string) =>
    fs.copyFile(from, path.join(outdir.renderer, to));

  const createPackageJson = async () => {
    const packageJson = JSON.parse(await fs.readFile(path.join(config.root, 'package.json'), 'utf-8'))
    const json: any = pick(['name', 'version', 'license', 'author', 'description'], packageJson)
    json.main = 'app.js'
    await fs.writeFile(path.join(outdir.app, 'package.json'), JSON.stringify(json, null, 2))
  }

  await Promise.all([
    copyToPublic(path.join(appSrc, config.paths.html || 'index.html'), 'index.html'),
    config.paths.assetsDir && fs.cp(
      path.join(appSrc, config.paths.assetsDir),
      outdir.renderer,
      { recursive: true, force: true },
    ),
    createPackageJson(),
  ])
}
