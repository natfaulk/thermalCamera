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
    d.setCanvasSize(
      this.props.settings.canvasSize.x,
      this.props.settings.canvasSize.y
    )

    this.setState({d})

    this.timer = setInterval(()=>{
      let _d = this.state.d
      if (_d !== null && this.props.data !== null) {
        _d.background('black')
        this.draw()
      }
    }, 1000/100)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  draw() {
    let _data = this.props.data
    let _canvas = this.state.d
    let _settings = this.props.settings

    for (let y = 0; y < _data.length; ++y) {
      for (let x = 0; x < _data[y].length; ++x) {
        let col = this.tempToCol(_data[y][x], _settings.tempRange.min, _settings.tempRange.max)
        let sqsize = _settings.canvasSize.x / _data.length
        _canvas.fill(col)
        _canvas.stroke(col)
        _canvas.rect(sqsize * x, sqsize * y, sqsize, sqsize)
      }
    }
  }

  tempToCol(_temp) {
    let tmin = this.props.settings.tempRange.min
    let tmax = this.props.settings.tempRange.max

    let dist = tmax - tmin
    let scale = 240 / dist
    let col = Math.round((_temp - tmin) * scale)
    if (col < 0) col = 0
    if (col > 240) col = 240
    return `hsl(${240-col},100%,50%)`
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

export default Canvas
