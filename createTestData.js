var {randomBytes} = require('crypto')

var s = []
for (let i = 0; i <100; i++) {

    s.push({
        item:i,
        data: randomBytes(12).toString('base64')
    })
    
}

console.log(s)

require('fs').writeFileSync('testdata.json',JSON.stringify(s))