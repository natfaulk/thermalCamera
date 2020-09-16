import React from 'react'
import makeLogger from '@natfaulk/supersimplelogger'
import mindrawingjs from 'mindrawingjs'

import './Canvas.css'

const logger = makeLogger('Canvas')

class Canvas extends React.Component {
  constructor(props) {
    super()

    this.state = {
      d: null
    }
  }

  componentDidMount() {
    logger(`New canvas created with ID: ${this.props.id}`)
    let d = new mindrawingjs()
    d.setup(this.canvas)
    d.background('black')
    d.setCanvasSize(400,400)

    this.setState({d})
  }

  componentDidUpdate(_prevProps, _prevState) {
    // logger(this.props.data)

    let _d = this.state.d
    if (_d !== null && this.props.data !== null) {
      _d.background('black')
      // _d.fill('red')
      // _d.rect(Math.random()*_d.width, Math.random()*_d.height, 100, 100)

      let data = reshape(this.props.data)
      draw(_d, data, {
        canvasSize: {x: 400, y: 400},
        tempRange: {min:18, max:25}
      })
    }
  }

  render() {
    return <>
      <div >
        <canvas id="this.props.id" ref={canvas => this.canvas = canvas}></canvas>
        <br />
        <div><span className="faint">{this.props.id}</span></div>
      </div>
    </>
  }
}

let draw = (_canvas, _data, _settings) => {
  for (let y = 0; y < _data.length; ++y) {
    for (let x = 0; x < _data[y].length; ++x) {
      let col = tempToCol(_data[y][x], _settings.tempRange.min, _settings.tempRange.max)
      let sqsize = _settings.canvasSize.x / _data.length
      _canvas.fill(col)
      _canvas.stroke(col)
      _canvas.rect(sqsize * x, sqsize * y, sqsize, sqsize)
    }
  }
}

let tempToCol = (_temp, _tempMin, _tempMax) => {
  let dist = _tempMax - _tempMin
  let scale = 240 / dist
  let col = Math.round((_temp - _tempMin) * scale)
  if (col < 0) col = 0
  if (col > 240) col = 240
  return `hsl(${240-col},100%,50%)`
}

let reshape = _data => {
  let out = []
  
  for (let x = 0; x < 8; ++x) {
    let temp = []
    for (let y = 0; y < 8; ++y) {
      temp.push(_data[(7-y)*8 + x])
    }
    out.push(temp)
  }
  
  return out
}

export default Canvas
