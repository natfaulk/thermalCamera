process.env.SSLOGGER_PROCESS_PREFIX = 'COMPORT'

const SerialPort = require('serialport')
const http = require('http')
const logger = require('@natfaulk/supersimplelogger')('Index')

const MSG_HEADER = '[data] '

;(()=>{
  const port = new SerialPort('COM4', {
    baudRate: 115200
  })

  let portWrapper = {
    port: port,
    buff: ''
  }

  port.on('error', err => {
    console.log('Error: ', err.message)
  })

  port.on('data', data => {
    portWrapper.buff += data.toString('utf8')
    let msgs = portWrapper.buff.split('\n')
    
    while(msgs.length > 1) {
      let latest = msgs.shift()
      if (latest.startsWith(MSG_HEADER)) sendData(latest.slice(MSG_HEADER.length))
      else logger('Invalid serial data')
    }
    if (msgs.length > 0) portWrapper.buff = msgs[0]
  })

})()

let sendData = _data => {
  let postData = _data

  let options = {
    host: '127.0.0.1',
    path: '/update',
    port: 3001,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  let req = http.request(options, res => {
    let data = ''

    res.on('data', chunk => {
      data += chunk
    })

    res.on('end', () => {
      // console.log(data)
    })
  }).on('error', err => {
    console.log(`Error: ${err.message}`)
  })

  req.write(postData)
}
