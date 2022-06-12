{ nixpkgs ? import <nixpkgs> { }, ... }:

nixpkgs.mkShell {
  buildInputs = with nixpkgs; with elmPackages; [
    elm
    create-elm-app
    elm-format
    elm-language-server
    nodejs-16_x
    yarn
  ];
}
