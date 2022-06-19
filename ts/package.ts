import electronPackager from 'electron-packager'
import { fetchConfig } from './utils/config'

export const packageApp = async ({ platform }: { platform: string[] }) => {
  const cwd = process.cwd()
  const { outdir } = await fetchConfig(cwd, __dirname)

  const pkgs = await electronPackager({
    dir: outdir.app,
    out: outdir.packageOutput,
    asar: true,
    overwrite: true,
    ...(platform?.length > 0 ? { platform } : {})
    // icon: '',
  })

  console.log(pkgs)
}
