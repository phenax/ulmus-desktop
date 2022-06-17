module Ulmus.Json exposing (..)

import Json.Decode
import Json.Decode.Pipeline exposing (required)
import Json.Encode as Enc


encodePair : Enc.Value -> Enc.Value -> Enc.Value
encodePair a b =
    Enc.list identity [ a, b ]


decodePair : Json.Decode.Decoder a -> Json.Decode.Decoder b -> Json.Decode.Decoder ( a, b )
decodePair a b =
    Json.Decode.map2
        Tuple.pair
        (Json.Decode.index 0 a)
        (Json.Decode.index 1 b)


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
