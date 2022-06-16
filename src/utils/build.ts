import esbuild, { BuildOptions } from 'esbuild'
// @ts-ignore
import ElmPlugin from 'esbuild-plugin-elm'

export const bundle = ({
  entryPoint,
  elmConfig,
  cwd,
  ...config
}: {
  entryPoint: string,
  elmConfig?: any
  cwd: string,
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

