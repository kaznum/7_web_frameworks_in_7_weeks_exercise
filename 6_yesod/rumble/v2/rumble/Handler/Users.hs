module Handler.Users where

import Import

getUsersR :: Handler Html
getUsersR = do
  users <- runDB $ selectList [] [Asc UserIdent]
  (userFormWidget, enctype) <- generateFormPost userForm
  defaultLayout $(widgetFile "users")

postUsersR :: Handler Html
postUsersR = error "Not yet implemented: postUsersR"

userForm :: Form User
userForm = renderDivs $ User
           <$> areq textField "ID" Nothing
           <*> aopt textField "Password" Nothing
