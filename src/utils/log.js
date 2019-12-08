const path  = require('path')
const fs = require('fs')


// Create Stream
function writeLogStream(fileName){
  const fullFileNmae = path.join(__dirname, '../','../','logs',fileName)
  const writeStream = fs.createWriteStream(fullFileNmae,{
    flags:'a'
  })
  return writeStream
}

// write log
function writeLog(stream,log){
  stream.write(log+'\n')
}

// write access log
const accessWriteStream = writeLogStream('access.log')

function access(log){
  writeLog(accessWriteStream,log)
}

module.exports = {
  access
}

