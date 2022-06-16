import path from 'path'
import { promises as fs } from 'fs'

export type Config = {
  root: string,
  outdir: string,
  paths: {
    main: string,
    renderer: string,
    assetsDir?: string,
    'js:main'?: string,
    'js:renderer'?: string,
  },
}

export const fetchConfig = async (cwd: string, currentSrc: string): Promise<Config> => {
  const cfgPath = path.join(cwd, './ulmus.json')

  let file = ''
  try {
    file = await fs.readFile(cfgPath, 'utf-8')
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      throw new Error(`Unable to find ulmus-desktop.json at path ${cfgPath}`)
    }
    throw e
  }

  const cfg = JSON.parse(file) as unknown as Config

  if (!cfg.paths?.main || !cfg.paths?.renderer) {
    const missingFiles = [
      cfg.paths?.main && 'file.main',
      cfg.paths?.renderer && 'file.renderer',
    ]
      .filter(Boolean)
      .join(' and ')

    throw new Error(`Please specify ${missingFiles} in ulmus-desktop.json`)
  }

  cfg.root = path.join(cwd, cfg.root || '.')
  cfg.outdir = path.join(cfg.root, cfg.outdir || 'dist')

  cfg.paths = Object.fromEntries(
    Object.entries(cfg.paths || {})
      .map(([key, file]) => [
        key,
        path.relative(currentSrc, path.join(cfg.root, file))
      ])
  ) as Config['paths']

  return cfg
}

