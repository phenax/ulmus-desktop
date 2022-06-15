module Renderer exposing (..)

import Browser exposing (Document)
import Browser.Navigation as Navigation
import Html
import Html.Events exposing (onClick)
import IPC exposing (FromMainMsg, FromRendererMsg(..), decodeMainMsg, encodeRendererMsg)
import Json.Decode
import Ulmus.IPC exposing (receive, send)
import Ulmus.Renderer
import Url


main : Program Flags Model Msg
main =
    Ulmus.Renderer.makeRenderer
        { view = view
        , update = update
        , init = init
        , subscriptions = subscriptions
        , onUrlRequest = \_ -> Noop
        , onUrlChange = \_ -> Noop
        }


type alias Model =
    ()


type Msg
    = Noop
    | SendToMain FromRendererMsg
    | GotMainMsg (Result Json.Decode.Error FromMainMsg)


type alias Flags =
    ()


init : Flags -> Url.Url -> Navigation.Key -> ( Model, Cmd Msg )
init _ _ _ =
    ( (), Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SendToMain m ->
            ( model, send <| encodeRendererMsg <| m )

        _ ->
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
    receive (GotMainMsg << Json.Decode.decodeValue decodeMainMsg)
