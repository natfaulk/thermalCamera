const { interp2d } = require("./interp")

class Pixel {
  constructor (_settings) {
    this.calibrate()
    this.settings = _settings
    if (this.settings.numCalibVals <= 0) this.calibrated = true
  }

  calibrate() {
    this.calibrated = false
    this.calcount = 0
    this.value = 0
    this.offset = 0
  }

  update(_val) {
    if (this.calibrated === false) {
      ++this.calcount
      this.offset += _val / this.settings.numCalibVals

      if (this.calcount >= this.settings.numCalibVals) {
        this.calibrated = true
        this.calcount = 0
      }
    } else this.value = _val - this.offset
  }

  get() {
    if (this.calibrated === false) return 0
    return this.value
  }
}

class Sensor {
  constructor(_id, _settings) {
    this.id = _id
    this.settings = _settings    
    let w = _settings.camera.width
    let h = _settings.camera.height
    
    this.pixels = []
    
    for (let i = 0; i < w*h; ++i) {
      this.pixels.push(new Pixel(_settings))
    }
  }

  process(_data) {
    _data.forEach((_d, _i) => this.pixels[_i].update(_d))
    let out = interp2d(this.getPixelData(), this.settings.interpFactor)

    if (this.settings.thresholdOn) out = threshold(
      out,
      this.settings.thresholdVal,
      this.settings.tempRange.min,
      this.settings.tempRange.max
    )

    return out
  }

  getPixelData() {
    let out = []
  
    for (let x = 0; x < 8; ++x) {
      let temp = []
      for (let y = 0; y < 8; ++y) {
        temp.push(this.pixels[(7-y)*8 + x].get())
      }
      out.push(temp)
    }
    
    return out
  }
}

let threshold = (_data, _thresh, _zeroVal = 0, _oneVal = 1) => {
  return _data.map(_d1 => _d1.map(_d2 => {
    if (_d2 < _thresh) return _zeroVal
    return _oneVal
  }))
}

module.exports = {
  Sensor
}
