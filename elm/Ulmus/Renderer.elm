module Ulmus.Renderer exposing (..)

import Browser
import Browser.Navigation
import Ulmus.IPC exposing (Receiver, Sender)
import Url


makeRenderer :
    { init : flags -> Url.Url -> Browser.Navigation.Key -> ( model, Cmd msg )
    , view : model -> Browser.Document msg
    , update : msg -> model -> ( model, Cmd msg )
    , subscriptions : model -> Sub msg
    , onUrlRequest : Browser.UrlRequest -> msg
    , onUrlChange : Url.Url -> msg
    }
    -> Program flags model msg
makeRenderer =
    Browser.application
