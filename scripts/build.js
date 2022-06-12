const path = require('path')
const esbuild = require('esbuild')
const ElmPlugin = require('esbuild-plugin-elm')

esbuild.build({
  entryPoints: ['src/client.js'],
  outdir: 'dist/',
  bundle: true,
  watch: true,
  define: {
    'process.env.MAIN': JSON.stringify('../example/src/Main.elm'),
  },
  plugins: [
    ElmPlugin({
      clearOnWatch: true,
    }),
  ],
}).catch(e => (console.error(e), process.exit(1)))

