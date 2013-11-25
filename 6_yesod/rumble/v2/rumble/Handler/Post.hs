module Handler.Post where

import Import
import Data.Maybe
import Yesod.Auth
import Handler.Comments (commentForm)

getPostR :: PostId -> Handler Html
getPostR postId = do
  authId <- maybeAuthId
  (post, author, comments, commentsWithAuthors) <- runDB $ do
    post <- get404 postId
    author <- get404 $ postAuthor post
    comments <- selectList [CommentPost ==. postId] [Asc CommentCreated]
    authors <- mapM (get . commentAuthor . entityVal) comments
    return (post, author, comments, zip (map entityVal comments) (map fromJust authors))
  (commentFormWidget, enctype) <- generateFormPost $ commentForm postId
  defaultLayout $ do
    setTitle $ toHtml $ (postTitle post) <> " - Rumble"
    $(widgetFile "post-full")

generateCommentWidget :: Comment -> User -> Widget
generateCommentWidget comment author = $(widgetFile "comment")
