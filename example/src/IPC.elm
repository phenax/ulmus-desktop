module IPC exposing (..)

import Json.Decode exposing (Decoder, oneOf)
import Json.Decode.Pipeline exposing (required)
import Json.Encode as Enc
import Ulmus.Json exposing (decodeWindow, encodeWindow)
import Ulmus.Types exposing (Window)


type FromRendererMsg
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


decodeVariant : String -> a -> Json.Decode.Decoder a
decodeVariant kind fn =
    decodeAsType kind
        |> Json.Decode.map (\_ -> fn)


encodeRendererMsg : FromRendererMsg -> Enc.Value
encodeRendererMsg msg =
    case msg of
        LogMessage text ->
            Enc.object
                [ ( "type", Enc.string "LogMessage" )
                , ( "message", Enc.string text )
                ]

        OpenInWindow window ->
            Enc.object
                [ ( "type", Enc.string "OpenInWindow" )
                , ( "window", encodeWindow window )
                ]


decodeRendererMsg : Json.Decode.Decoder FromRendererMsg
decodeRendererMsg =
    oneOf
        [ decodeVariant "LogMessage" LogMessage |> required "message" Json.Decode.string
        , decodeVariant "OpenInWindow" OpenInWindow |> required "window" decodeWindow
        ]


type FromMainMsg
    = NoopMain


decodeMainMsg : Json.Decode.Decoder FromMainMsg
decodeMainMsg =
    oneOf
        [ decodeVariant "Foobar" NoopMain
        ]


encodeMainMsg : FromMainMsg -> Enc.Value
encodeMainMsg msg =
    case msg of
        NoopMain ->
            Enc.object [ ( "type", Enc.string "Noop" ) ]
