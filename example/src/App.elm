module App exposing (..)

import IPC exposing (FromMainMsg(..), FromRendererMsg(..), decodeRendererMsg, encodeMainMsg)
import Ulmus.Api.Window exposing (Attribute(..), WindowID, createWindow, onPageLoaded, onWindowClosed)
import Ulmus.App
import Ulmus.IPC exposing (sendMain)


sendToRenderer : WindowID -> FromMainMsg -> Cmd msg
sendToRenderer =
    sendMain encodeMainMsg


type alias Flags =
    { foobar : String }


type alias Model =
    ()


type Msg
    = OnPageLoaded WindowID
    | OnWindowClosed WindowID


init : Flags -> ( Model, Cmd Msg )
init f =
    let
        _ =
            Debug.log "flags" f
    in
    ( (), createWindow "main" "/" [] )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        _ =
            Debug.log "update" msg
    in
    case msg of
        OnPageLoaded windowId ->
            ( model, sendToRenderer windowId NoopMain )

        _ ->
            ( model, Cmd.none )


updateFromRenderer : ( WindowID, FromRendererMsg ) -> Model -> ( Model, Cmd Msg )
updateFromRenderer ( windowId, rmsg ) model =
    case rmsg of
        LogMessage x ->
            let
                _ =
                    Debug.log "Loging " ( windowId, x )
            in
            ( model, Cmd.none )

        _ ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ onWindowClosed OnWindowClosed
        , onPageLoaded OnPageLoaded
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
