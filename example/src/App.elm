module App exposing (..)

import IPC exposing (MainMsg, RendererMsg, decodeRendererMsg)
import Json.Decode
import Ulmus.IPC exposing (receive)
import Ulmus.Server


type alias Flags =
    ()


type alias Model =
    { ulmusModel : Ulmus.Server.Model }


type Msg
    = UlmusMsg Ulmus.Server.Msg
    | GotRendererMsg (Result Json.Decode.Error RendererMsg)


init : Flags -> ( Model, Cmd Msg )
init _ =
    let
        ( uModel, uCmd ) =
            Ulmus.Server.init {}

        cmd =
            Cmd.map UlmusMsg uCmd
    in
    ( { ulmusModel = uModel }, cmd )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UlmusMsg uMsg ->
            let
                ( uModel, cmd ) =
                    Ulmus.Server.update uMsg model.ulmusModel
            in
            ( { ulmusModel = uModel }, Cmd.map UlmusMsg cmd )

        GotRendererMsg m ->
            let
                _ =
                    Debug.log "from renderer" m
            in
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Sub.map UlmusMsg <| Ulmus.Server.subscriptions model.ulmusModel
        , receive (GotRendererMsg << Json.Decode.decodeValue decodeRendererMsg)
        ]


main : Program Flags Model Msg
main =
    Ulmus.Server.makeApp
        { init = init, update = update, subscriptions = subscriptions }
