port module Ulmus.App exposing (..)

import Platform
import Ulmus.Types exposing (..)


port createWindow : Window -> Cmd msg


makeApp :
    { init : flags -> ( model, Cmd msg )
    , update : msg -> model -> ( model, Cmd msg )
    , subscriptions : model -> Sub msg
    }
    -> Program flags model msg
makeApp =
    Platform.worker
