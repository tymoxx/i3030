# Telegram Bot i3030

### Development
`yarn install`

run dev server: `yarn dev`

ngrok: `ngrok http http://localhost:443`

remember to set the ngrok **https** URL to .env file


### Heroku:
(add Heroku app as a Git remote, if needed: `heroku git:remote -a yourapp`)

Deploy:
`git push heroku main`

See Logs:
`heroku logs --source app`

Temporarily stop the Heroku server:
`heroku maintenance:on`

## Chat History Importer
It is a project for importing Telegram chat history to Mongo DB.
`cd history-mporter`

`node index.js`
