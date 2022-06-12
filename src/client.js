const $root = document.createElement('div');
document.body.appendChild($root);

import(process.env.MAIN).then(async ({ Elm }) => {
  const Main = Object.values(Elm).find(m => typeof m.init === 'function')

  Main.init({
    node: $root,
  })
})

