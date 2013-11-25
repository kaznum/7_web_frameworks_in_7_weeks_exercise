module Handler.PostNew where

import Import
import Data.Time
import Yesod.Auth

postForm :: Form (UserId -> Int -> UTCTime -> Post)
postForm = renderDivs $ Post
           <$> areq textField "Title" Nothing
           <*> areq textField "URL" Nothing

getPostNewR :: Handler Html
getPostNewR = do
  _ <- requireAuthId
  (postFormWidget, enctype) <- generateFormPost postForm
  defaultLayout $(widgetFile "post-new")

postPostNewR :: Handler Html
postPostNewR = do
  authorId <- requireAuthId
  ((result, _), _) <- runFormPost postForm
  case result of
    FormSuccess makePost -> do
      time <- liftIO getCurrentTime
      post <- runDB $ insert $ makePost authorId 0 time
      redirect $ PostR post
    _ -> defaultLayout [whamlet|whoops|]

