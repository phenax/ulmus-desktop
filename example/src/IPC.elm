module IPC exposing (..)

import Json.Decode exposing (oneOf)
import Json.Encode as Enc
import Ulmus.Api.Window exposing (..)
import Ulmus.Json exposing (decodeVariant, encodeVariant)


type ToMainMsg
    = OpenInWindow Window
    | LogMessage String


type ToRendererMsg
    = NoopMain


encodeRendererMsg : ToMainMsg -> Enc.Value
encodeRendererMsg msg =
    case msg of
        LogMessage text ->
            encodeVariant "LogMessage" <| Enc.object [ ( "message", Enc.string text ) ]

        OpenInWindow window ->
            encodeVariant "OpenInWindow" <| Enc.object [ ( "window", encodeWindow window ) ]


decodeRendererMsg : Json.Decode.Decoder ToMainMsg
decodeRendererMsg =
    oneOf
        [ decodeVariant "LogMessage" <|
            Json.Decode.map LogMessage
                (Json.Decode.field "message" Json.Decode.string)
        , decodeVariant "OpenInWindow" <|
            Json.Decode.map OpenInWindow
                (Json.Decode.field "window" decodeWindow)
        ]


decodeMainMsg : Json.Decode.Decoder ToRendererMsg
decodeMainMsg =
    oneOf
        [ decodeVariant "Foobar" <|
            Json.Decode.succeed NoopMain
        ]


encodeMainMsg : ToRendererMsg -> Enc.Value
encodeMainMsg msg =
    case msg of
        NoopMain ->
            encodeVariant "Foobar" Enc.null
