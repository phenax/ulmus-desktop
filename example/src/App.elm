module App exposing (..)

import IPC exposing (FromMainMsg, FromRendererMsg(..), decodeRendererMsg, encodeMainMsg)
import Ulmus.App
import Ulmus.IPC exposing (send)


sendToRenderer : FromMainMsg -> Cmd msg
sendToRenderer =
    send << encodeMainMsg


type alias Flags =
    ()


type alias Model =
    ()


type Msg
    = SendFrontendMsg FromMainMsg


init : Flags -> ( Model, Cmd Msg )
init _ =
    ( (), Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SendFrontendMsg m ->
            ( model, sendToRenderer m )


updateFromRenderer : FromRendererMsg -> Model -> ( Model, Cmd Msg )
updateFromRenderer rmsg model =
    case rmsg of
        LogMessage x ->
            let
                _ =
                    Debug.log "[DEBUG]" x
            in
            ( model, Cmd.none )

        _ ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


main : Ulmus.App.MainApp Flags Model FromRendererMsg Msg
main =
    Ulmus.App.makeApp
        { init = init
        , update = update
        , updateFromRenderer = updateFromRenderer
        , decoder = decodeRendererMsg
        , subscriptions = subscriptions
        }
