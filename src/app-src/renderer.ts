const $root = document.createElement('div');
document.body.appendChild($root);

import(process.env.MAIN as string).then(async ({ Elm }) => {
  const Main: any = Object.values(Elm).find((m: any) => typeof m.init === 'function')

  if (!Main) {
    throw new Error(`Invalid module. Expected elm module ${process.env.MAIN}`)
  }

  const app = Main.init({ node: $root });

  const $ulmus: any = (window as any).$ulmus
  if ($ulmus) {
    $ulmus.receive((msg: any) => {
      if (app.ports.receive) {
        app.ports.receive.send(msg)
      } else {
        console.error('Renderer process is not listening for messages')
      }
    })

    app.ports.send?.subscribe((msg: any) => $ulmus.send(msg))
  }
})

