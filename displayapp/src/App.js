import makeLogger from '@natfaulk/supersimplelogger'
import React from 'react'
import './App.css'
import Canvasses from './Canvasses.js'
import checkKeyHasVal from './utils'
import { Sensor } from './sensor'

const logger = makeLogger('App')

let settings = {
  interpFactor: 5,
  thresholdVal: 2,
  thresholdOn: false,
  numCalibVals: 20,
  tempRange: {min: 0, max: 5},
  camera: {width:8, height: 8},
  canvasSize: {x: 400, y: 400}
}

class App extends React.Component {
  constructor(props) {
    super()

    this.devices = {}
    this.ws = null
    
    this.state = {
      deviceData: []
    }
  }

  componentDidMount() {
    this.startWebsocket()
    // this.sensor = new Sensor(settings)

  }

  addDevice(_id) {
    this.devices[_id] = new Sensor(_id, settings)
    logger(`Added device with ID: ${_id}`)
  }

  updateDeviceData(_data) {
    let processedData = this.devices[_data.ID].process(_data.data)
    let newDeviceData = this.state.deviceData

    let devFound = false
    for (let i = 0; i < newDeviceData.length; ++i) {
      if (newDeviceData[i].id === _data.ID) {
        newDeviceData[i].data = processedData
        devFound = true
        break
      }
    }

    if (!devFound) {
      newDeviceData.push({id:_data.ID, data:processedData})
    }

    this.setState({deviceData: newDeviceData})
  }
  
  startWebsocket() {
    const ws = new WebSocket('ws://localhost:3001')
    ws.addEventListener('open', _event => {
      logger('WS connection made')
    })
  
    ws.addEventListener('message', _event => {
      // logger(`WS message: ${_event.data}`)
      let dataParsed = {}
      try {
        dataParsed = JSON.parse(_event.data)
      } catch(e) {
        logger(`Failed to parse incoming json, ${e}`)
        logger(`Incoming string: ${_event.data}`)
        return
      }
  
      if (!checkKeyHasVal(dataParsed, 'ID')) return
      if (!checkKeyHasVal(dataParsed, 'data')) return
      if (!checkKeyHasVal(this.devices, dataParsed.ID)) this.addDevice(dataParsed.ID)  
      this.updateDeviceData(dataParsed)
    })
  
    ws.addEventListener('error', _event=> {
      logger(`WS error: ${_event}`)
    })
  
    ws.addEventListener('close', _event=> {
      logger(`WS close: ${_event}`)
    })    
  
    this.ws = ws
  }

  render() {
    return <>
      <h1>Temperature sensors</h1>
      <Canvasses devices={this.state.deviceData} settings={settings} />
    </>
    
  }
}

export default App
