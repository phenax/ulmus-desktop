port module Ulmus.IPC exposing (..)


type alias Sender m msg =
    m -> Cmd msg


type alias Receiver m msg =
    (m -> msg) -> Sub msg


port send_ : Sender String msg


port receive_ : Receiver String msg
