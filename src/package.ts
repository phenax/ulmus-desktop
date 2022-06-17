import electronPackager from 'electron-packager'
import { fetchConfig } from './utils/config'

export const packageApp = async () => {
  const cwd = process.cwd()
  const config = await fetchConfig(cwd, __dirname)
  const dist = config.outdir

  const pkgs = await electronPackager({
    dir: dist,
    out: './dist-package',
    asar: true,
    overwrite: true,
    // platform: [],
    // icon: '',
  })
  console.log(pkgs)
}
