const logger = require('@natfaulk/supersimplelogger')('Display')

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

let text = _data => {
  let td = document.getElementById("text-display")
  td.innerHTML = JSON.stringify(_data)
}

let tempToCol = (_temp, _tempMin, _tempMax) => {
  let dist = _tempMax - _tempMin
  let scale = 240 / dist
  let col = Math.round((_temp - _tempMin) * scale)
  if (col < 0) col = 0
  if (col > 240) col = 240
  return `hsl(${240-col},100%,50%)`
}

module.exports = {
  draw,
  text
}