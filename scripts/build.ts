const path = require('path')
const { promises: fs } = require('fs')
const esbuild = require('esbuild')
const ElmPlugin = require('esbuild-plugin-elm')

const cwdRelative = '../example'
const cwd = path.join(__dirname, cwdRelative)

const dist = path.join(cwd, 'dist')
const distRenderer = path.join(dist, 'renderer')

const paths = {
  renderer: path.join(cwdRelative, 'src/Renderer.elm'),
  app: path.join(cwdRelative, 'src/App.elm'),
}

const buildRenderer = () => esbuild.build({
  entryPoints: [path.join(__dirname, '../src/renderer.ts')],
  outdir: distRenderer,
  bundle: true,
  watch: false,
  absWorkingDir: cwd,
  define: {
    'process.env.MAIN': JSON.stringify(paths.renderer),
  },
  plugins: [
    ElmPlugin({
      cwd,
      pathToElm: 'elm',
    }),
  ],
})

const buildApp = () => esbuild.build({
  entryPoints: [path.join(__dirname, '../src/app.ts')],
  outdir: dist,
  bundle: true,
  watch: false,
  platform: 'node',
  format: 'cjs',
  external: ['electron'],
  absWorkingDir: cwd,
  define: {
    'process.env.MAIN': JSON.stringify(paths.app),
    'process.env.PUBLIC_DIR': JSON.stringify(distRenderer),
  },
  plugins: [
    ElmPlugin({
      cwd,
      pathToElm: 'elm',
    }),
  ],
})

const main = async () => {
  await Promise.all([buildRenderer(), buildApp()])
  await Promise.all([
    fs.copyFile('./src/index.html', path.join(distRenderer, 'index.html')),
  ])
}

main()
  .catch(e => (console.error(e), process.exit(1)))

