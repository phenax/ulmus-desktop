module Ulmus.Json exposing (..)

import Json.Decode
import Json.Decode.Pipeline exposing (required)
import Json.Encode
import Ulmus.Types exposing (..)

decodeWindow : Json.Decode.Decoder Window
decodeWindow =
    Json.Decode.succeed Window |> required "path" Json.Decode.string

encodeWindow : Window -> Json.Encode.Value
encodeWindow w = Json.Encode.object [ ("path", Json.Encode.string w.path) ]

