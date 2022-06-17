port module Ulmus.Api.Window exposing (..)

import Json.Decode
import Json.Decode.Pipeline exposing (required)
import Json.Encode as Enc
import Ulmus.Json exposing (decodeVariant, encodeVariant)


type Target
    = Path String
    | Url String


type Attribute
    = Width Int
    | Height Int
    | Resizable Bool
    | Fullscreen Bool
    | Frameless
    | Transparent
    | DisableDevtools


decodeAttribute : Json.Decode.Decoder Attribute
decodeAttribute =
    Json.Decode.oneOf
        [ decodeVariant "Width" <| Json.Decode.map Width <| Json.Decode.int
        , decodeVariant "Height" <| Json.Decode.map Height <| Json.Decode.int
        , decodeVariant "Resizable" <| Json.Decode.map Resizable <| Json.Decode.bool
        , decodeVariant "Fullscreen" <| Json.Decode.map Fullscreen <| Json.Decode.bool
        , decodeVariant "Frameless" <| Json.Decode.succeed Frameless
        , decodeVariant "Transparent" <| Json.Decode.succeed Transparent
        , decodeVariant "DisableDevtools" <| Json.Decode.succeed DisableDevtools
        ]


encodeAttribute : Attribute -> Enc.Value
encodeAttribute attr =
    case attr of
        Width w ->
            encodeVariant "Width" <| Enc.int w

        Height h ->
            encodeVariant "Height" <| Enc.int h

        Resizable r ->
            encodeVariant "Resizable" <| Enc.bool r

        Fullscreen f ->
            encodeVariant "Fullscreen" <| Enc.bool f

        Frameless ->
            encodeVariant "Frameless" Enc.null

        DisableDevtools ->
            encodeVariant "DisableDevtools" Enc.null

        Transparent ->
            encodeVariant "Transparent" Enc.null


type alias WindowID =
    String


type alias Window =
    { path : String, id : WindowID, attributes : List Attribute }


decodeWindow : Json.Decode.Decoder Window
decodeWindow =
    Json.Decode.succeed Window
        |> required "path" Json.Decode.string
        |> required "id" Json.Decode.string
        |> required "attributes" (Json.Decode.list decodeAttribute)


encodeWindow : Window -> Enc.Value
encodeWindow w =
    Enc.object
        [ ( "path", Enc.string w.path )
        , ( "id", Enc.string w.id )
        , ( "attributes", Enc.list encodeAttribute w.attributes )
        ]



-- Actions


port createWindowPort : Enc.Value -> Cmd msg


createWindow : WindowID -> String -> List Attribute -> Cmd msg
createWindow id path attrs =
    { id = id, path = path, attributes = attrs }
        |> encodeWindow
        |> createWindowPort


port updateWindowAttributesPort : ( WindowID, Enc.Value ) -> Cmd msg


updateWindowAttributes : WindowID -> List Attribute -> Cmd msg
updateWindowAttributes id =
    updateWindowAttributesPort << Tuple.pair id << Enc.list encodeAttribute



-- Events


port onWindowReadyToShow : (WindowID -> msg) -> Sub msg


port onBeforeWindowClose : (WindowID -> msg) -> Sub msg


port onWindowClosed : (WindowID -> msg) -> Sub msg
