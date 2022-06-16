module Renderer exposing (..)

import Browser exposing (Document)
import Browser.Navigation as Navigation
import Html
import Html.Events exposing (onClick)
import IPC exposing (FromMainMsg(..), FromRendererMsg(..), decodeMainMsg, encodeRendererMsg)
import Ulmus.IPC exposing (send)
import Ulmus.Renderer
import Url


sendToMain : FromRendererMsg -> Cmd msg
sendToMain =
    send << encodeRendererMsg


main : Ulmus.Renderer.Renderer Flags Model FromMainMsg Msg
main =
    Ulmus.Renderer.makeRenderer
        { view = view
        , update = update
        , init = init
        , decoder = decodeMainMsg
        , updateFromMain = updateFromMain
        , subscriptions = subscriptions
        , onUrlRequest = \_ -> Noop
        , onUrlChange = \_ -> Noop
        }


type alias Model =
    ()


type Msg
    = Noop
    | SendToMain FromRendererMsg


type alias Flags =
    ()


init : Flags -> Url.Url -> Navigation.Key -> ( Model, Cmd Msg )
init _ _ _ =
    ( (), Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SendToMain m ->
            ( model, sendToMain m )

        _ ->
            ( model, Cmd.none )


updateFromMain : FromMainMsg -> Model -> ( Model, Cmd Msg )
updateFromMain msg model =
    let
        _ =
            Debug.log "msg" msg
    in
    ( model, Cmd.none )


view : Model -> Document Msg
view _ =
    { title = "Title"
    , body =
        [ Html.button [ onClick <| SendToMain <| LogMessage "Doing stuff" ] [ Html.text "Go" ]
        , Html.text "wow"
        ]
    }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
