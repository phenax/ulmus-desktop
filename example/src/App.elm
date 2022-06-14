module App exposing (..)

import IPC exposing (FromMainMsg, FromRendererMsg, decodeRendererMsg, encodeMainMsg)
import Json.Decode
import Ulmus.App
import Ulmus.IPC exposing (receive, send)


type alias Flags =
    ()


type alias Model =
    ()


type Msg
    = GotRendererMsg (Result Json.Decode.Error FromRendererMsg)
    | SendFrontendMsg FromMainMsg


init : Flags -> ( Model, Cmd Msg )
init _ =
    ( (), Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotRendererMsg m ->
            let
                _ =
                    Debug.log "from renderer" m
            in
            ( model, Cmd.none )

        SendFrontendMsg m ->
            ( model, send <| encodeMainMsg <| m )


subscriptions : Model -> Sub Msg
subscriptions _ =
    receive (GotRendererMsg << Json.Decode.decodeValue decodeRendererMsg)


main : Program Flags Model Msg
main =
    Ulmus.App.makeApp
        { init = init, update = update, subscriptions = subscriptions }
