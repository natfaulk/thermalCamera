const logger = require('@natfaulk/supersimplelogger')('INDEX')
const express = require('express')
const Mindrawing = require('mindrawingjs')
const Display = require('./display')
const Process = require('./process')
const fs = require('fs')
const os = require('os')

let settings = {
  canvasSize: {x: 800, y: 800},
  tempRange: {min:18, max:25},
  interpFactor: 5,
  thresholdVal: 2,
  thresholdOn: false,
  numCalibVals: 20,
  tempRange: {
    min: 0,
    max: 5
  }
}

;(()=>{
  const port = 3001
  const app = express()

  let d = new Mindrawing()
  d.setup('display')
  d.setCanvasSize(settings.canvasSize.x, settings.canvasSize.y)
  d.background('black')

  // let out = fs.createWriteStream('out.log');

  // let dataRaw = fs.readFileSync('out_paper.log', 'utf8').split('\n')
  // let allData = []
  // dataRaw.forEach(_line => {
  //   if(_line.length > 2) allData.push(JSON.parse(_line))
  // })

  // for (let i = 0; i < settings.numCalibVals; ++i) {
  //   Process.process(allData[i], settings)
  // }

  
  // let temp2 = Process.process(allData[180], settings)
  // let tempFlat = []
  // temp2.forEach(t=>{
  //   tempFlat.push(...t)
  // })
  // settings.tempRange.min = Math.min(...tempFlat).toFixed(1)
  // settings.tempRange.max = Math.max(...tempFlat).toFixed(1)
  // console.log(`Min: ${settings.tempRange.min}, Max: ${settings.tempRange.max}`)

  // Display.draw(d, temp2, settings)
  // console.log(temp2)

  // for (let i = 0; i < 100; i++)
  // {
  //   d.fill(`hsl(${2.4*i}, 100%, 50%)`)
  //   d.stroke(`hsl(${2.4*i}, 100%, 50%)`)
  //   d.rect(0, i*8, 100, 8)
  // }

  app.use(express.json())
  app.get('/', (req, res) => res.send('Hello World!'))
  app.post('/update', (req, res) => {
    // out.write(JSON.stringify(req.body.data))
    // out.write(os.EOL)
    let data = Process.process(req.body.data, settings)
    Display.draw(d, data, settings)
    Display.text(data)
    res.send('ack')
  })
  
  app.listen(port, () => logger(`Listening at http://localhost:${port}`))
})()

