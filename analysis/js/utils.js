const fs = require('fs')

let mkdir_p = _dir => {
  if (!fs.existsSync(_dir)) {
    fs.mkdirSync(_dir)
  }
}

module.exports = {
  mkdir_p
}
