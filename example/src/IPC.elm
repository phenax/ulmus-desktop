module IPC exposing (..)

import Json.Decode exposing (oneOf)
import Json.Encode as Enc
import Ulmus.Api.Window exposing (..)
import Ulmus.Json exposing (decodeVariant, encodeVariant)


type FromRendererMsg
    = OpenInWindow Window
    | LogMessage String


type FromMainMsg
    = NoopMain


encodeRendererMsg : FromRendererMsg -> Enc.Value
encodeRendererMsg msg =
    case msg of
        LogMessage text ->
            encodeVariant "LogMessage" <| Enc.object [ ( "message", Enc.string text ) ]

        OpenInWindow window ->
            encodeVariant "OpenInWindow" <| Enc.object [ ( "window", encodeWindow window ) ]


decodeRendererMsg : Json.Decode.Decoder FromRendererMsg
decodeRendererMsg =
    oneOf
        [ decodeVariant "LogMessage" <|
            Json.Decode.map LogMessage
                (Json.Decode.field "message" Json.Decode.string)
        , decodeVariant "OpenInWindow" <|
            Json.Decode.map OpenInWindow
                (Json.Decode.field "window" decodeWindow)
        ]


decodeMainMsg : Json.Decode.Decoder FromMainMsg
decodeMainMsg =
    oneOf
        [ decodeVariant "Foobar" <|
            Json.Decode.succeed NoopMain
        ]


encodeMainMsg : FromMainMsg -> Enc.Value
encodeMainMsg msg =
    case msg of
        NoopMain ->
            encodeVariant "Foobar" Enc.null
