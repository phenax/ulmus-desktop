const $root = document.createElement('div');
document.body.appendChild($root);

import(process.env.MAIN as string).then(async ({ Elm }) => {
  const Main: any = Object.values(Elm).find((m: any) => typeof m.init === 'function')

  if (!Main) {
    throw new Error(`Invalid module. Expected elm module ${process.env.MAIN}`)
  }

  Main.init({
    node: $root,
  })
})

