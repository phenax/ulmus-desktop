import path from 'path'
import { promises as fs } from 'fs'

export type Config = {
  root: string,
  outdir: string,
  files: {
    main: string,
    renderer: string,
    'js:main'?: string,
    'js:renderer'?: string,
  },
}

export const fetchConfig = async (cwd: string, currentSrc: string): Promise<Config> => {
  const cfgPath = path.join(cwd, './ulmus-desktop.json')

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

  if (!cfg.files?.main || !cfg.files?.renderer) {
    const missingFiles = [
      cfg.files?.main && 'file.main',
      cfg.files?.renderer && 'file.renderer',
    ]
      .filter(Boolean)
      .join(' and ')

    throw new Error(`Please specify ${missingFiles} in ulmus-desktop.json`)
  }

  cfg.root = path.join(cwd, cfg.root || '.')
  cfg.outdir = path.join(cfg.root, cfg.outdir || 'dist')

  cfg.files = Object.fromEntries(
    Object.entries(cfg.files || {})
      .map(([key, file]) => [
        key,
        path.relative(currentSrc, path.join(cfg.root, file))
      ])
  ) as Config['files']

  return cfg
}

