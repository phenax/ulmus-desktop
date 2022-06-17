module App exposing (..)

import IPC exposing (FromMainMsg(..), FromRendererMsg(..), decodeRendererMsg, encodeMainMsg)
import Ulmus.Api.Window exposing (Attribute(..), WindowID, createWindow, onWindowClosed, onWindowReadyToShow)
import Ulmus.App
import Ulmus.IPC exposing (send)


sendToRenderer : FromMainMsg -> Cmd msg
sendToRenderer =
    send << encodeMainMsg


type alias Flags =
    { foobar : String }


type alias Model =
    { windows : List WindowID }


type Msg
    = SendToRenderer FromMainMsg
    | OnWindowReadyToShow WindowID
    | OnWindowClosed WindowID


init : Flags -> ( Model, Cmd Msg )
init f =
    let
        _ =
            Debug.log "flags" f

        windowId =
            "main"

        windowAttrs =
            [ Frameless, DisableDevtools ]
    in
    ( { windows = [ windowId ] }, createWindow windowId "/" windowAttrs )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SendToRenderer m ->
            ( model, sendToRenderer m )

        _ ->
            let
                _ =
                    Debug.log "update" msg
            in
            ( model, Cmd.none )


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
    Sub.batch
        [ onWindowClosed OnWindowClosed
        , onWindowReadyToShow OnWindowReadyToShow
        ]


main : Ulmus.App.MainApp Flags Model FromRendererMsg Msg
main =
    Ulmus.App.makeApp
        { init = init
        , update = update
        , updateFromRenderer = updateFromRenderer
        , decoder = decodeRendererMsg
        , subscriptions = subscriptions
        }
