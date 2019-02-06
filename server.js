const app = require('express')()
const sharp = require('sharp')
const bodyParser = require('body-parser')
const fileExists = require('file-exists')
const cookieParser = require('cookie-parser')
const tf = require('@tensorflow/tfjs-node')
const getPixels = require("get-pixels")

const fs = require('fs')
const path = require('path')

const web_client_path = __dirname + '/web_client/'
const html_path = web_client_path + 'html/'
const js_path = web_client_path + 'js/'
const css_path = web_client_path + 'css/'
const image_path = web_client_path + 'images/'
const audio_path = web_client_path + 'audio/'

app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser()); // for parsing cookies

var model
var images

tf.loadModel('file://./Model/model.json').then(res => {
    model = res
})

console.log('------------------------------------------')

fs.readdir('images', (err, files) => {
    if (err)  throw err

    images = new Array(files.length + 1)
  })

app.get('/', (req, res) => {
    if (req.cookies.id) {
        res.redirect('/process')
    } else res.redirect('/predict')
})

app.get('/js/:file', (req, res) => {
    fileExists(js_path + req.params.file, function (err, exists) {

        if (exists)  res.sendFile(js_path + req.params.file)
        else res.sendStatus(404)
        
    })
})

app.get('/css/:file', (req, res) => {
    fileExists(css_path + req.params.file, function (err, exists) {

        if (exists)  res.sendFile(css_path + req.params.file)
        else res.sendStatus(404)

    })
})

app.get('/images/:file', (req, res) => {
    fileExists(image_path + req.params.file, function (err, exists) {

        if (exists)  res.sendFile(image_path + req.params.file)
        else res.sendStatus(404)

    })
})

app.get('/audio/:file', (req, res) => {
    fileExists(audio_path + req.params.file, function (err, exists) {

        if (exists)  res.sendFile(audio_path + req.params.file)
        else res.sendStatus(404)

    })
})


app.get('/predict', (req, res) => {
    res.sendFile(html_path + 'predict.html')
})

app.post('/process', (req, res) => {

    let b64 = req.body.image
    let id = images.length;

    if (b64) {

        b64 = b64.replace('data:image/png;base64,', '') // Delete useless text at the beginnning of the string

        images.push('processing')

        res.cookie('id', id)
        res.sendFile(html_path + 'processing.html')

        let file = path.join(__dirname, 'images', 'image_' + id + '.png')

        // Save file
        sharp(Buffer.from(b64, 'base64'))
            .extract({ left: 80, top: 0, width: 480, height: 480 })
            .resize(128, 128)
            .toFile(file, err => {
                if (err) console.error("YEET!: " + err)

                if (err)  console.log("Bad image path")

                console.log("got pixels", pixels.shape.slice())
                console.log(pixels)

                image = tf.fromPixels(pixels)
                console.log(image)
                    
                console.log('starting')
                image = tf.reshape(image, [1, 128, 128, 3])
                console.log('done')
        
                const data = model.predict(image)
                console.log(data)
            })

    } else res.sendStatus(400) // No image specified: bad request
    
})

app.get('/process', (req, res) => {
    if (req.cookies.id) {
        res.sendFile(html_path + 'processing.html')
    } else res.redirect('/predict')
})

app.get('/results', (req, res) => {
    let infected = parseInt(req.cookies.infected)

    if (infected == 1) {
        res.sendFile(html_path + 'infected.html')

    } else if (infected == 0) {
        res.sendFile(html_path + 'ok.html')

    } else res.sendStatus(400) // Invalid results specified: bad request

})

app.post('/getStatus', (req, res) => {
    let id = parseInt(req.cookies.id)
    res.send('' + images[id])
})

app.get('*', (req, res) => {
    res.redirect('/')
})

app.listen(8080, () => {
    console.log('listening on *:8080')
})
