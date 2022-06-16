module Ulmus.Renderer exposing (..)

import Browser
import Browser.Navigation
import Html
import Json.Decode
import Ulmus.IPC exposing (receive)
import Ulmus.Types exposing (..)
import Url


type Msg mmsg msg
    = GotMainMsg (Result Json.Decode.Error mmsg)
    | AppMsg msg


type alias Renderer flags model mmsg msg =
    Program flags model (Msg mmsg msg)


toAppUpdate : ( model, Cmd msg ) -> ( model, Cmd (Msg fmsg msg) )
toAppUpdate =
    Tuple.mapSecond (Cmd.map AppMsg)


makeRenderer :
    { init : flags -> Url.Url -> Browser.Navigation.Key -> ( model, Cmd msg )
    , view : model -> Browser.Document msg
    , update : msg -> model -> ( model, Cmd msg )
    , updateFromMain : mmsg -> model -> ( model, Cmd msg )
    , subscriptions : model -> Sub msg
    , decoder : Json.Decode.Decoder mmsg
    , onUrlRequest : Browser.UrlRequest -> msg
    , onUrlChange : Url.Url -> msg
    }
    -> Renderer flags model mmsg msg
makeRenderer { init, view, update, updateFromMain, subscriptions, decoder, onUrlChange, onUrlRequest } =
    Browser.application
        { init = \f u k -> init f u k |> toAppUpdate
        , view =
            \model ->
                let
                    { title, body } =
                        view model
                in
                { title = title
                , body = body |> List.map (Html.map AppMsg)
                }
        , update =
            \msg model ->
                case msg of
                    AppMsg m ->
                        update m model |> toAppUpdate

                    GotMainMsg mmsg ->
                        case mmsg of
                            Ok m ->
                                updateFromMain m model |> toAppUpdate

                            _ ->
                                ( model, Cmd.none )
        , subscriptions =
            \model ->
                Sub.batch
                    [ subscriptions model |> Sub.map AppMsg
                    , receive (Json.Decode.decodeValue decoder) |> Sub.map GotMainMsg
                    ]
        , onUrlChange = onUrlChange >> AppMsg
        , onUrlRequest = onUrlRequest >> AppMsg
        }
