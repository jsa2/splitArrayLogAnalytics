
var fs = require('fs')
var c = fs.readFileSync('testdata.json').toString()
var data = JSON.parse(c)

// Set count of throttle 
Throttld(22)
var count = 0

async function Throttld(burstCount) {
    var fullar = []
    var burstArray = []
    var residue = data.length % burstCount

    console.log('residue is', residue)

    for await (item of data) {

        count++

        burstArray.push(item)

        if (count % burstCount == 0) {
            console.log('chunk sent')
            fullar.push(burstArray)
            var burstArray = []
        }
    }
    var resid = data.splice((data.length - residue), data.length)
    fullar.push(resid)
    console.log(fullar)
}
