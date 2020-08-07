const Interp = require('./interp').interp2d

const NUM_CAL_VALS = 20;
let background = null

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

let initBackground = (_dataLen, _settings) => {
  background = []

  for (let i = 0; i < _dataLen; ++i) {
    background.push(new Pixel(_settings))
  }
}

let process = (_data, _settings) => {
  if (background === null) initBackground(_data.length, _settings)

  _data.forEach((_d, _i) => background[_i].update(_d))

  let out = reshape(background)
  out = Interp(out, _settings.interpFactor)
  if (_settings.thresholdOn) out = threshold(
    out,
    _settings.thresholdVal,
    _settings.tempRange.min,
    _settings.tempRange.max
  )

  return out
}

let reshape = _data => {
  let out = []
  
  for (let x = 0; x < 8; ++x) {
    let temp = []
    for (let y = 0; y < 8; ++y) {
      temp.push(_data[(7-y)*8 + x].get())
    }
    out.push(temp)
  }
  
  return out
}

let threshold = (_data, _thresh, _zeroVal = 0, _oneVal = 1) => {
  return _data.map(_d1 => _d1.map(_d2 => {
    if (_d2 < _thresh) return _zeroVal
    return _oneVal
  }))
}

module.exports = {process}