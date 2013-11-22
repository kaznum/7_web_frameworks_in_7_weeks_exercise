module Handler.Greet2 where

import Import

getGreet2R :: Text -> Handler Html
getGreet2R name = defaultLayout $ do
                    color <- return ("blue" :: Text)
                    setTitle "Greetings"
                    toWidget [lucius| .greet { font-weight: bold; color: #{color}; }|]
                    toWidget [whamlet|<p .greet>Well met, #{name}!|]

