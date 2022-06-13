const path = require('path')
const { promises: fs } = require('fs')
const esbuild = require('esbuild')
const ElmPlugin = require('esbuild-plugin-elm')

const buildClient = () => esbuild.build({
  entryPoints: ['src/client.ts'],
  outdir: 'dist/',
  bundle: true,
  watch: false,
  define: {
    'process.env.MAIN': JSON.stringify('../example/src/Renderer.elm'),
  },
  plugins: [
    ElmPlugin(),
  ],
})

const buildWorker = () => esbuild.build({
  entryPoints: ['src/app.ts'],
  outdir: 'dist/',
  bundle: true,
  watch: false,
  platform: 'node',
  format: 'cjs',
  external: ['electron'],
  define: {
    'process.env.MAIN': JSON.stringify('../example/src/App.elm'),
  },
  plugins: [
    ElmPlugin(),
  ],
})

const copyFiles = () => Promise.all([
  fs.copyFile('./src/index.html', './dist/index.html'),
])

Promise.all([buildClient(), buildWorker(), copyFiles()])
  .catch(e => (console.error(e), process.exit(1)))

