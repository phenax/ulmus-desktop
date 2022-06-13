module IPC exposing (..)

import Ulmus.Server exposing (Window)


type RendererMsg
    = OpenInWindow Window
    | LogMessage String


type MainMsg
    = NoopMain
