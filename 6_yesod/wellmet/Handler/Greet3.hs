module Handler.Greet3 where

import Import

getGreet3R :: Text -> Handler Html
getGreet3R name = defaultLayout $(widgetFile "greet3")
    where color = "blue" :: Text

