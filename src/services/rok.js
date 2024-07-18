const fs = require("fs")
const path = require('path')
const cv = require('/usr/lib/node_modules/opencv4nodejs');

const rokTitleImagePath =  path.join(__dirname, '../assets/', 'rok-title.png')
const userAvatarImagePath = path.join(__dirname, '../assets/', 'avatar.png')



function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}


function getBase64StringMat(screenshotBase64){
    const base64data =screenshotBase64.replace('data:image/jpeg;base64','')
                                .replace('data:image/png;base64','');//Strip image type prefix
    const buffer = Buffer.from(base64data,'base64');
    const mat = cv.imdecode(buffer);
    return mat
}

async function findCutoutPosition (
    screenshotBase64
) {
  const similarityThreshold = 0.8
  const originalImage = getBase64StringMat(screenshotBase64);
  const cutoutImage = await cv.imreadAsync(rokTitleImagePath);

  const originalImageToGray = originalImage.cvtColor(cv.COLOR_BGR2GRAY);
  const cutoutImageToGray = cutoutImage.cvtColor(cv.COLOR_BGR2GRAY);

  const matched = originalImageToGray.matchTemplate(
    cutoutImageToGray,
    cv.TM_CCOEFF_NORMED
  );
  const { maxLoc, maxVal } = matched.minMaxLoc();

  console.log(123123123,maxLoc.x,maxLoc.y,maxVal)

  if (maxVal >= similarityThreshold) {
    return {
      x: maxLoc.x,
      y: maxLoc.y,
    };
  }
};

async function isInHomeLand(screenshotBase64){
    const similarityThreshold = 0.8
    const originalImage = getBase64StringMat(screenshotBase64);
    const cutoutImage = await cv.imreadAsync(userAvatarImagePath);
  
    const originalImageToGray = originalImage.cvtColor(cv.COLOR_BGR2GRAY);
    const cutoutImageToGray = cutoutImage.cvtColor(cv.COLOR_BGR2GRAY);
  
    const matched = originalImageToGray.matchTemplate(
      cutoutImageToGray,
      cv.TM_CCOEFF_NORMED
    );
    const { maxLoc, maxVal } = matched.minMaxLoc();
    if (maxVal >= similarityThreshold) {
      return true
    }
    return false
}

module.exports = {
    findCutoutPosition,
    isInHomeLand
};