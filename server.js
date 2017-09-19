var express = require('express')
  , logger = require('morgan')
  , app = express()
  , jade = require('jade')
  , template = jade.compileFile(__dirname + '/source/templates/homepage.jade')
  , audioTemplate = jade.compileFile(__dirname + '/source/templates/audiopage.jade')
  , socketVideoTemplate = jade.compileFile(__dirname + '/source/templates/socketvideo.jade')

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))

app.get('/', function (req, res, next) {
  try {
    var html = template({ title: 'Home' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})

app.get('/audio', function (req, res, next) {
  try {
    var html = audioTemplate({ title: 'Audio' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})

app.get('/socketvideo', function (req, res, next) {
  try {
    var html = socketVideoTemplate({ title: 'Socket Video' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
