port module Ulmus.Server exposing (..)

import Json.Decode
import Json.Decode.Pipeline exposing (required)
import Platform
import Ulmus.Types exposing (..)


port createWindow : Window -> Cmd msg



decodeWindow : Json.Decode.Decoder Window
decodeWindow =
    Json.Decode.succeed Window |> required "path" Json.Decode.string


type alias Model =
    ()


type Msg
    = CreateWindow Window
    | Noop


type alias Config =
    {}


makeApp :
    { init : flags -> ( model, Cmd msg )
    , update : msg -> model -> ( model, Cmd msg )
    , subscriptions : model -> Sub msg
    }
    -> Program flags model msg
makeApp =
    Platform.worker


init : Config -> ( Model, Cmd Msg )
init _ =
    ( (), createWindow { path = "/" } )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        CreateWindow w ->
            ( model, createWindow w )

        _ ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
