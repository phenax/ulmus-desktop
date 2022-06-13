module Renderer exposing (..)

import Browser exposing (Document)
import Browser.Navigation as Navigation
import Html
import IPC exposing (MainMsg, RendererMsg)
import Ulmus.IPC exposing (Receiver, Sender)
import Ulmus.Renderer
import Url


main : Program Flags Model Msg
main =
    Ulmus.Renderer.makeRenderer
        { view = view
        , update = update
        , init = init
        , subscriptions = \_ -> Sub.none
        , onUrlRequest = \_ -> Noop
        , onUrlChange = \_ -> Noop
        }


type alias Model =
    ()


type Msg
    = Noop


type alias Flags =
    ()


init : Flags -> Url.Url -> Navigation.Key -> ( Model, Cmd Msg )
init _ _ _ =
    ( (), Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update _ s =
    ( s, Cmd.none )


view : Model -> Document Msg
view _ =
    { title = "Title"
    , body = [ Html.text "wow" ]
    }
