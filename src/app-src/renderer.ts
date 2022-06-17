import { initElmModule } from "src/utils/elm";

const main = async () => {
  const $root = document.createElement('div');
  document.body.appendChild($root);

  const app = await initElmModule({ node: $root });

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
}

main()
