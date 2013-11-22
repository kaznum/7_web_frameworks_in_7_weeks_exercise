module Handler.Users where

import Import

getUsersR :: Handler Html
getUsersR = do
  users <- runDB $ selectList [] [Asc UserIdent]
  (userFormWidget, enctype) <- generateFormPost userForm
  defaultLayout $(widgetFile "users")

postUsersR :: Handler Html
postUsersR = do
  ((result, _), _) <- runFormPost userForm
  case result of
    FormSuccess user -> do
                _ <- runDB $ insert user
                redirect UsersR
    _ -> defaultLayout [whamlet|whoops|]

userForm :: Form User
userForm = renderDivs $ User
           <$> areq textField "ID" Nothing
           <*> aopt textField "Password" Nothing
