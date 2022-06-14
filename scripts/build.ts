import path from 'path'
import { promises as fs } from 'fs'
import esbuild, { BuildOptions } from 'esbuild'
// @ts-ignore
import ElmPlugin from 'esbuild-plugin-elm'

const cwdRelative = '../example'
const cwd = path.join(__dirname, cwdRelative)

const dist = path.join(cwd, 'dist')
const distRenderer = path.join(dist, 'renderer')

const paths = {
  renderer: path.join(cwdRelative, 'src/Renderer.elm'),
  app: path.join(cwdRelative, 'src/App.elm'),
  ipcTypes: path.join(cwdRelative, 'src/IPC.elm'),
}

const bundle = ({
  entryPoint,
  elmConfig,
  ...config
}: {
  entryPoint: string,
  elmConfig?: any
} & BuildOptions) =>
  esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    watch: false,
    external: ['electron'],
    absWorkingDir: cwd,
    plugins: [
      ElmPlugin({
        cwd,
        pathToElm: 'elm',
        ...elmConfig,
      }),
    ],
    ...config,
  })

const buildPreload = () => bundle({
  entryPoint: path.join(__dirname, '../src/preload.ts'),
  outdir: distRenderer,
})

const buildRenderer = () => bundle({
  entryPoint: path.join(__dirname, '../src/renderer.ts'),
  outdir: distRenderer,
  define: {
    'process.env.MAIN': JSON.stringify(paths.renderer),
  },
})

const buildApp = () => bundle({
  entryPoint: path.join(__dirname, '../src/app.ts'),
  outdir: dist,
  platform: 'node',
  format: 'cjs',
  define: {
    'process.env.MAIN': JSON.stringify(paths.app),
    'process.env.PUBLIC_DIR': JSON.stringify(distRenderer),
  },
})

const main = async () => {
  await Promise.all([buildRenderer(), buildApp(), buildPreload()])
  await Promise.all([
    fs.copyFile('./src/index.html', path.join(distRenderer, 'index.html')),
  ])
}

main()
  .catch(e => (console.error(e), process.exit(1)))

