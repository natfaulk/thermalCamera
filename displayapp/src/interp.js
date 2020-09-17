;(()=>{
  let interp2d = (_buff, nPoints) => {
    let out = []
    for (let i = 0; i < _buff.length; i++) {
      out.push([])
      if (i < _buff.length - 1) for (let j = 0; j < nPoints; j++) {
        out.push([])
      }
    }
  
    out.forEach(element => {
      for (let i = 0; i < _buff[0].length + (_buff[0].length - 1) * nPoints; i++) element.push(0)
    })
  
    // console.log(out)
  
    for (let i = 0; i < _buff.length; i++) {
      for (let j = 0; j < _buff[0].length; j++) {
        out[i * (nPoints + 1)][j * (nPoints + 1)] = _buff[i][j]
      }
    }
  
    // output filled with all known values
    // now interpolate across
    for (let i = 0; i < _buff.length; i++) {
      for (let j = 0; j < _buff[0].length - 1; j++) {
        for (let k = 1; k <= nPoints; k++) {
          let tY = i * (nPoints + 1)
          let tX = j * (nPoints + 1)
  
          // if too close to edge use linear interpolation
          // else use cubic (the cubic needs 4 points whereas lerp only needs 2)
          if (j === 0 || j === _buff[0].length - 2) {
            out[tY][tX + k] = lerp(out[tY][tX], out[tY][tX + nPoints + 1], k / (nPoints + 1))
          } else {
            out[tY][tX + k] = cubic(
              out[tY][tX - (nPoints + 1)],
              out[tY][tX],
              out[tY][tX + (nPoints + 1)],
              out[tY][tX + 2*(nPoints + 1)],
              k / (nPoints + 1)
              )
          }
        }
      }
    }
  
    // now interpolate down
    for (let j = 0; j < out[0].length; j++) {
      for (let i = 0; i < _buff.length - 1; i++) {
        for (let k = 1; k <= nPoints; k++) {
          let tY = i * (nPoints + 1)
          let tX = j
          if (i === 0 || i === _buff.length - 2) {
            out[tY + k][tX] = lerp(out[tY][tX], out[tY + nPoints + 1][tX], k / (nPoints + 1))
          } else {
            out[tY + k][tX] = cubic(
              out[tY - (nPoints + 1)][tX],
              out[tY][tX],
              out[tY + (nPoints + 1)][tX],
              out[tY + 2*(nPoints + 1)][tX],
              k / (nPoints + 1)
              )
          }
        }
      }
    }
  
    return out
  }
  
  let lerp = (_v1, _v2, _mu) => {
    return _v1*(1-_mu) + _v2*_mu
  }
  
  let cubic = (_v0, _v1, _v2, _v3, _mu) => {
    let mu2 = _mu*_mu
    let a0 = _v3 - _v2 - _v0 + _v1
    let a1 = _v0 - _v1 - a0
    let a2 = _v2 - _v0
    let a3 = _v1
  
    return a0*_mu*mu2 + a1*mu2 + a2*_mu + a3
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      interp2d
    }
  }
})() 

// ripped off the lerp and cubic from here
// http://paulbourke.net/miscellaneous/interpolation//
