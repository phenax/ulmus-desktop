module IPC exposing (..)

import Json.Decode exposing (Decoder, oneOf)
import Json.Decode.Pipeline exposing (custom, required)
import Ulmus.Server exposing (decodeWindow)
import Ulmus.Types exposing (Window)


type RendererMsg
    = OpenInWindow Window
    | LogMessage String


decodeAsType : String -> Decoder String
decodeAsType name =
    Json.Decode.succeed identity
        |> required "type" Json.Decode.string
        |> Json.Decode.andThen
            (\n ->
                if name == n then
                    Json.Decode.succeed name

                else
                    Json.Decode.fail "Invalid type"
            )


decodeVariant : String -> (a -> b) -> Json.Decode.Decoder (a -> b)
decodeVariant kind fn =
    decodeAsType kind
        |> Json.Decode.map (\_ -> fn)


decodeRendererMsg : Json.Decode.Decoder RendererMsg
decodeRendererMsg =
    oneOf
        [ decodeVariant "LogMessage" LogMessage |> required "message" Json.Decode.string
        , decodeVariant "OpenInWindow" OpenInWindow |> required "window" decodeWindow
        ]


type MainMsg
    = Foobar String Int


decodeMainMsg : Json.Decode.Decoder MainMsg
decodeMainMsg =
    oneOf
        [ decodeVariant "Foobar" Foobar
            |> custom Json.Decode.string
            |> custom Json.Decode.int
        ]
