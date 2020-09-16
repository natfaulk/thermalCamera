import React from 'react'
import makeLogger from '@natfaulk/supersimplelogger'
import checkKeyHasVal from './utils'

import './Canvasses.css'
import Canvas from './Canvas.js'

const logger = makeLogger('Canvasses')

class Canvasses extends React.Component {
  constructor(props) {
    super()

    this.state = {
      devices: [],
      deviceIdCache: {}
    }
  }

  componentDidMount() {
    const ws = new WebSocket('ws://localhost:3001')
    ws.addEventListener('open', _event => {
      logger('WS connection made')
      // ws.send('Hello Server!')
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

      if (
        checkKeyHasVal(dataParsed, 'ID')
        && !checkKeyHasVal(this.state.deviceIdCache, dataParsed.ID)
      ) {
        this.addDevice(dataParsed.ID)
      }

      if (
        checkKeyHasVal(dataParsed, 'data') 
        && checkKeyHasVal(this.state.deviceIdCache, dataParsed.ID)
      ) {
        let devices = this.state.devices
        devices[this.state.deviceIdCache[dataParsed.ID]].data = dataParsed.data
        this.setState({devices: this.state.devices})
      }
    })

    ws.addEventListener('error', _event=> {
      logger(`WS error: ${_event}`)
    })

    ws.addEventListener('close', _event=> {
      logger(`WS close: ${_event}`)
    })    
  }

  addDevice(_id) {
    let newCache = {}
    let devices = []

    this.state.devices.forEach(_dev => {
      devices.push(_dev)
    })
    devices.push({id: _id, data: null})

    devices.forEach((_dev, _i) => {
      newCache[_dev.id] = _i
    })

    this.setState({
      deviceIdCache: newCache,
      devices
    })

    logger(`Added device with ID: ${_id}`)
  }

  render() {
    return <>
      <div className="canvas-container">
        {this.state.devices.map(_device => 
        <div key={_device.id} className="canvas-inner">
          <Canvas id={_device.id} data={_device.data} />
        </div>
        )}
      </div>
    </>
  }
}

export default Canvasses
