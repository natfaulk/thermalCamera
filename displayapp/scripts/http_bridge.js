process.env.SSLOGGER_PROCESS_PREFIX = 'COMTEST'

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const Websocket = require('ws')

const logger = require('@natfaulk/supersimplelogger')('Index')

const MSG_HEADER = '[data] '
const WS_PORT = 3001

;(async ()=>{
  logger('Process started')

  logger('Starting Websocket server...')
  const wss = new Websocket.Server({port: WS_PORT})

  wss.on('connection', _ws => {
    logger('WS connection made.')
    _ws.send('YEEEET')
    
    _ws.on('message', _data => {
      logger(`Received: ${_data}`)
    })

    _ws.on('close', () => {
      logger('WS connection closed.')
    })

    _ws.on('error', (_ws, _err) => {
      logger(`WS error: ${_err}`)
    })
  })

  const sendData = _data => {
    wss.clients.forEach(_client => {
      if (_client.readyState === Websocket.OPEN) {
        _client.send(_data)
      }
    })
  }

  let ports = await SerialPort.list()
  ports.forEach(_port => {
    if (_port.manufacturer === 'wch.cn') {
      logger(`Found port ${_port.path}`)
      openPort(_port.path, sendData)
    }
  })
  
})()

let openPort = (_path, _sendData) => {
  logger(`Opening ${_path}...`)

  let isThermoBoard = false

  const port = new SerialPort(_path, {
    baudRate: 115200
  })

  const parser = port.pipe(new Readline({delimiter: '\n'}))
  parser.on('data', _data => {
    _data = _data.trim()

    if (isThermoBoard && _data.startsWith(MSG_HEADER)) _sendData(_data.slice(MSG_HEADER.length))
    else if (!isThermoBoard && _data.includes('Thermo board')) isThermoBoard = true
    // else logger('Invalid serial data')
  })

  port.on('error', err => {
    logger(`[${_path}] Error: `, err.message)
  })

  port.on('open', () => {
    logger(`[${_path}] Port opened.`)
    logger(`[${_path}] Sending reset command...`)
    port.write('r')

    // wait for it to boot up
    setTimeout(() => {
      // request board type
      port.write('i')
    }, 5000)
  })

  setTimeout(()=>{
    if (!isThermoBoard) {
      logger(`[${_path}] Serial port is not a thermo board. Closing...`)
      port.close(_err => {
        if (_err) logger(`[${_path}] Failed to close port...`)
        else logger(`[${_path}] Port closed.`)
      })
    } else {
      port.write('s')
    }
  }, 10000)

  return port
}
