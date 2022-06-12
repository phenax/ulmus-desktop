const path = require('path')
const esbuild = require('esbuild')
const ElmPlugin = require('esbuild-plugin-elm')

const buildClient = () => esbuild.build({
  entryPoints: ['src/client.js'],
  outdir: 'dist/',
  bundle: true,
  watch: false,
  define: {
    'process.env.MAIN': JSON.stringify('../example/src/Client.elm'),
  },
  plugins: [
    ElmPlugin({
      clearOnWatch: true,
    }),
  ],
})

const buildWorker = () => esbuild.build({
  entryPoints: ['src/app.js'],
  outdir: 'dist/',
  bundle: false,
  watch: false,
  platform: 'node',
  format: 'cjs',
  define: {
    // 'process.env.MAIN': JSON.stringify('../example/src/Client.elm'),
  },
  plugins: [
    ElmPlugin({
      clearOnWatch: true,
    }),
  ],
})

Promise.all([buildClient(), buildWorker()])
  .catch(e => (console.error(e), process.exit(1)))

