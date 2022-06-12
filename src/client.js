const $root = document.createElement('div');
document.body.appendChild($root);

import(process.env.MAIN).then(async ({ Elm: { Main } }) => {
  Main.init({
    node: $root,
  })
})

