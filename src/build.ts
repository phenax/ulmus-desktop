import path from 'path'
import { promises as fs } from 'fs'
import { bundle } from './utils/build'
import { fetchConfig } from './utils/config'

const main = async () => {
  const cwd = process.cwd()

  const config = await fetchConfig(cwd, __dirname)
  const dist = config.outdir
  const distRenderer = path.join(config.outdir, 'renderer')

  await Promise.all([
    bundle({
      entryPoint: path.join(__dirname, 'app.ts'),
      cwd: config.root,
      outdir: dist,
      platform: 'node',
      format: 'cjs',
      define: {
        'process.env.MAIN': JSON.stringify(config.files.main),
        'process.env.PUBLIC_DIR': JSON.stringify(distRenderer),
      },
    }),
    bundle({
      entryPoint: path.join(__dirname, 'renderer.ts'),
      cwd: config.root,
      outdir: distRenderer,
      define: {
        'process.env.MAIN': JSON.stringify(config.files.renderer),
      },
    }),
    bundle({
      cwd: config.root,
      entryPoint: path.join(__dirname, 'preload.ts'),
      outdir: distRenderer,
    }),
  ])

  await Promise.all([
    fs.copyFile(path.join(__dirname, 'index.html'), path.join(distRenderer, 'index.html')),
  ])
}

main()
  .catch(e => (console.error(e), process.exit(1)))

