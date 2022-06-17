
export const initElmModule = async (options: any = {}) => {
  const hooks = await getHooks()

  if (!process.env.MAIN) throw new Error('Missing elm module')

  const { Elm } = await import(process.env.MAIN as string)
  const Main: any = Object.values(Elm).find((m: any) => typeof m.init === 'function')

  if (!Main) {
    throw new Error(`Invalid module. Expected elm module ${process.env.MAIN}`)
  }

  const app = Main.init({ flags: await hooks.getFlags(), ...options });

  try {
    hooks.setup(app)
  } catch (e) {
    console.error(e)
  }

  return app
}

export const getHooks = async () => {
  const defaultHooks = { getFlags: () => ({}), setup(_: any) { } }

  if (process.env.JS_MODULE) {
    const jsMod = await import(process.env.JS_MODULE as string)
    return { ...defaultHooks, ...jsMod.default }
  }

  return defaultHooks
}

