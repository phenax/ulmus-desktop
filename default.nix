{ nixpkgs ? import <nixpkgs> { }, ... }:

let
  electron_pkg = nixpkgs.electron;
in
nixpkgs.mkShell {
  buildInputs = with nixpkgs; with elmPackages; [
    elm
    elm-format
    elm-language-server
    nodejs-16_x
    yarn
    electron_pkg
    patchelf
  ];

  ELECTRON_OVERRIDE_DIST_PATH = "${electron_pkg}/bin";
}
