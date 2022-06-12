module Client exposing (..)

import Html exposing (Html)
import Ulmus


main : Html msg
main =
    Html.text <| String.fromInt <| Ulmus.foo
