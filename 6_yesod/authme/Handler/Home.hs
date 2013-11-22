{-# LANGUAGE TupleSections, OverloadedStrings #-}
module Handler.Home where

import Import
import Yesod.Auth

getHomeR :: Handler Html
getHomeR = do
  user <- maybeAuth
  defaultLayout $ do
    setTitle "AuthMe"
    $(widgetFile "homepage")

