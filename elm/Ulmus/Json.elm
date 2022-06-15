module Ulmus.Json exposing (..)

import Json.Decode
import Json.Decode.Pipeline exposing (required)
import Json.Encode as Enc
import Ulmus.Types exposing (..)


decodeWindow : Json.Decode.Decoder Window
decodeWindow =
    Json.Decode.succeed Window |> required "path" Json.Decode.string


encodeWindow : Window -> Enc.Value
encodeWindow w =
    Enc.object [ ( "path", Enc.string w.path ) ]


decodeVariant : String -> Json.Decode.Decoder a -> Json.Decode.Decoder a
decodeVariant kind dec =
    Json.Decode.succeed identity
        |> required "type" Json.Decode.string
        |> Json.Decode.andThen
            (\name ->
                if kind == name then
                    Json.Decode.field "value" dec

                else
                    Json.Decode.fail "Unable to decode constructor type"
            )


encodeVariant : String -> Enc.Value -> Enc.Value
encodeVariant name value =
    Enc.object <| [ ( "type", Enc.string name ), ( "value", value ) ]
