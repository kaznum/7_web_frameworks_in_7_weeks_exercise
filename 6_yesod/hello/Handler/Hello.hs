module Handler.Hello where

import Import

getHelloR :: Handler Html
getHelloR = return "Hello, world!"

