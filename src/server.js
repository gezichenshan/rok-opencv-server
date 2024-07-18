const express = require('express');

const services = require('./services');
const rok = require('./services/rok')

const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.static(__dirname + '/views'));
app.use(require('body-parser').json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.sendFile('./index.html');
});

const requiresImgBase64 = (req, res, next) => {
  const { imgBase64 } = req.body;
  if (typeof imgBase64 !== 'string') {
    return res.status(404).send('imgData must be the base64 string of the image');
  }
  req.params.img = services.decodeFromBase64(imgBase64);
  return next();
}

app.post('/is_in_homeland', requiresImgBase64, async (req, res) => {
  try {
    
  const data = await rok.isInHomeLand(req.body.imgBase64)
  console.log('isInHomeLand',data)
  res.status(200).send(data)
  } catch (error) {
    console.log('error',error)
    res.status(400).send()
  }
});

app.post('/find_cutout_position', requiresImgBase64, async (req, res) => {
  const data = await rok.findCutoutPosition(req.body.imgBase64)
  console.log('rok-title position',data)
  res.status(200).send(data);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});