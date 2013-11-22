module Handler.Direct where

import Import
import Yesod.Auth
import Yesod.Auth.BrowserId

authLinkWidget :: Widget
authLinkWidget = do
  onclick <- createOnClick def AuthR
  loginIcon <- return $ PluginR "browserid" ["static", "sign-in.png"]
  [whamlet|<a href="javascript:#{onclick}()"><img src=@{AuthR loginIcon}></a>|]

getDirectR :: Handler Html
getDirectR = do
  user <- maybeAuth
  defaultLayout $ do
    setTitle "AuthMe Direct"
    $(widgetFile "direct")

