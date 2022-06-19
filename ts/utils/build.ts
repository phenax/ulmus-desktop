import esbuild, { BuildOptions } from 'esbuild'
// @ts-ignore
import ElmPlugin from 'esbuild-plugin-elm'

export const bundle = ({
  entryPoint,
  elmConfig,
  cwd,
  devMode = false,
  optimized = false,
  define,
  ...config
}: {
  entryPoint: string,
  elmConfig?: any
  cwd: string,
  devMode?: boolean,
  optimized?: boolean,
} & BuildOptions) =>
  esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    watch: devMode,
    minify: optimized,
    absWorkingDir: cwd,
    external: ['electron'],
    define: {
      ...(devMode ? {
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.DEV': 'true',
        'process.env.ELECTRON_IS_DEV': '1',
      } : {
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.DEV': 'false',
      }),
      ...define,
    },
    plugins: [
      ElmPlugin({
        cwd,
        pathToElm: 'elm',
        optimized,
        ...elmConfig,
      }),
    ],
    ...config,
  })

