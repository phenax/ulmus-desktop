port module Ulmus.Server exposing (..)

import Platform


port createWindow : Window -> Cmd msg


type alias Window =
    { path : String }


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
