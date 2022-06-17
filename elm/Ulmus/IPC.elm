port module Ulmus.IPC exposing (..)

import Json.Decode
import Json.Encode
import Ulmus.Api.Window exposing (WindowID)


type alias Sender m msg =
    m -> Cmd msg


type alias Receiver m msg =
    (m -> msg) -> Sub msg


port send : Sender Json.Encode.Value msg


port receive : Receiver Json.Encode.Value msg


sendMain : (a -> Json.Encode.Value) -> WindowID -> Sender a msg
sendMain enc wid val =
    send <| Json.Encode.list identity [ Json.Encode.string wid, enc val ]


receiveMain : Json.Decode.Decoder a -> Receiver (Result Json.Decode.Error ( WindowID, a )) msg
receiveMain valDecoder fn =
    let
        decoder =
            Json.Decode.map2
                Tuple.pair
                (Json.Decode.index 0 Json.Decode.string)
                (Json.Decode.index 1 valDecoder)
    in
    Sub.map fn <| receive <| Json.Decode.decodeValue decoder
