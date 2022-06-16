module Ulmus.App exposing (..)

import Json.Decode
import Platform
import Ulmus.IPC exposing (receive)


type Msg rmsg msg
    = GotRendererMsg (Result Json.Decode.Error rmsg)
    | AppMsg msg


type alias MainApp flags model rmsg msg =
    Program flags model (Msg rmsg msg)


toAppUpdate : ( model, Cmd msg ) -> ( model, Cmd (Msg rmsg msg) )
toAppUpdate =
    Tuple.mapSecond (Cmd.map AppMsg)


makeApp :
    { init : flags -> ( model, Cmd msg )
    , update : msg -> model -> ( model, Cmd msg )
    , updateFromRenderer : rmsg -> model -> ( model, Cmd msg )
    , decoder : Json.Decode.Decoder rmsg
    , subscriptions : model -> Sub msg
    }
    -> MainApp flags model rmsg msg
makeApp { init, update, updateFromRenderer, decoder, subscriptions } =
    Platform.worker
        { init = init >> toAppUpdate
        , update =
            \msg model ->
                case msg of
                    GotRendererMsg rmsg ->
                        case rmsg of
                            Ok m ->
                                updateFromRenderer m model |> toAppUpdate

                            _ ->
                                ( model, Cmd.none )

                    AppMsg m ->
                        update m model |> toAppUpdate
        , subscriptions =
            \model ->
                Sub.batch
                    [ subscriptions model |> Sub.map AppMsg
                    , receive (Json.Decode.decodeValue decoder) |> Sub.map GotRendererMsg
                    ]
        }
