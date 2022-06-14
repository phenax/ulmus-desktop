module Elm.Example exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)


suite : Test
suite =
    describe "Example"
        [ test "should do stuff" <|
            \_ ->
                Expect.equal 1 1
        ]
