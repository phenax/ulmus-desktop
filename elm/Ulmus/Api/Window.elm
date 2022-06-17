port module Ulmus.Api.Window exposing (..)

import Json.Decode
import Json.Decode.Pipeline exposing (required)
import Json.Encode as Enc



-- type Position
--     = X Int
--     | Y Int
--     | Center
--
--
-- type Target
--     = Path String
--     | Url String
--
--
-- type Attribute
--     = Width Int
--     | Height Int
--     | Position Position
--     | NonResizable
--     | Icon String
--     | Frameless
--     | Transparent
--     | DisableDevtools
--
--
-- createWindow (Path "/") [ Width 800, Height 600, Frameless ]


type alias Window =
    { path : String }


port createWindow : Window -> Cmd msg


decodeWindow : Json.Decode.Decoder Window
decodeWindow =
    Json.Decode.succeed Window |> required "path" Json.Decode.string


encodeWindow : Window -> Enc.Value
encodeWindow w =
    Enc.object [ ( "path", Enc.string w.path ) ]
