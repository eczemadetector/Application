const app = require('express')()
const sharp = require('sharp')
const bodyParser = require('body-parser')
const fileExists = require('file-exists')
const cookieParser = require('cookie-parser')
const spawn = require('child_process').spawn
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

var images = []

console.log('------------------------------------------')

fs.readdir('images', (err, files) => { // Delete all previously saved images
    if (err) throw err;
  
    for (const file of files) {
        fs.unlink(path.join('images', file), err => {
            if (err) throw err;
        });
    }
});

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

    let image = req.body.image
    let id = images.length;

    if (image) {

        image = image.replace('data:image/png;base64,', '') // Delete useless text at the beginnning of the string

        images.push('processing')

        res.cookie('id', id)
        res.sendFile(html_path + 'processing.html')
        
        sharp(Buffer.from(image, 'base64'))
            .extract({ left: 80, top: 0, width: 480, height: 480 })
            .resize(128, 128)
            .toFile('images/image_' + id + '.png', err => {
                if (err) console.error(err)
            });


            let random = parseInt(Math.random() * 10)

            if (random < 8) {
                images[id] = 0

            } else images[id] = 1


/*

        const script = spawn('python3', ['python/test.py'])

        script.stdout.on('data', data => {

            if (data == 1) { // Hand has eczema
                images[id] = 1 

            } else if (data == 0) { // Hand is normal
                images[id] = 0
                
            } else {
                console.error('Invalid output: ' + data)
            }
        });

*/

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


