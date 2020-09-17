import React from 'react'
import makeLogger from '@natfaulk/supersimplelogger'

import './Canvasses.css'
import Canvas from './Canvas.js'

const logger = makeLogger('Canvasses')

class Canvasses extends React.Component {
  constructor(props) {
    super()
  }

  render() {
    return <>
      <div className="canvas-container">
        {this.props.devices.map(_device => 
        <div key={_device.id} className="canvas-inner">
          <Canvas id={_device.id} data={_device.data} settings={this.props.settings} />
        </div>
        )}
      </div>
    </>
  }
}

export default Canvasses
