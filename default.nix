with import <nixpkgs> { };
mkShell {
  buildInputs = with elmPackages; [
    elm
    elm-format
    elm-language-server
    nodejs-16_x
    yarn
    electron
    mdbook
    patchelf
  ];

  ELECTRON_OVERRIDE_DIST_PATH = "${electron}/bin";
}
