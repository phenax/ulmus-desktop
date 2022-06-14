port module Ulmus.IPC exposing (..)

import Json.Encode


type alias Sender m msg =
    m -> Cmd msg


type alias Receiver m msg =
    (m -> msg) -> Sub msg


port send : Sender Json.Encode.Value msg


port receive : Receiver Json.Encode.Value msg
