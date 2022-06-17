port module Ulmus.IPC exposing (..)

import Json.Decode
import Json.Encode
import Ulmus.Api.Window exposing (WindowID)
import Ulmus.Json exposing (decodePair, encodePair)


type alias Sender m msg =
    m -> Cmd msg


type alias Receiver m msg =
    (m -> msg) -> Sub msg


port send : Sender Json.Encode.Value msg


port receive : Receiver Json.Encode.Value msg


sendMain : (a -> Json.Encode.Value) -> WindowID -> Sender a msg
sendMain enc wid val =
    send <| encodePair (Json.Encode.string wid) (enc val)


receiveMain : Json.Decode.Decoder a -> Receiver (Result Json.Decode.Error ( WindowID, a )) msg
receiveMain valDecoder fn =
    decodePair Json.Decode.string valDecoder
        |> Json.Decode.decodeValue
        |> receive
        |> Sub.map fn
