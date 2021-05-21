var {PushToAzureLogs} = require('./src/laClient')
var fs = require('fs')
const { argv } = require('process')

// read file so it parses 
var f = fs.readFileSync('azuredata.json', 'utf16le').trim()
// Parse the file
var data = JSON.parse(f)
// If you use commandLineArgs then log name is taken from third argument
var LogType = argv[3]?.split('.json')[0] || 'monster'
//Get LA Config (Do not store stuff like this in prod)
var la = require('./config/key.json')

const laws = {
    id:la.id,
    key:la.key,
    rfc1123date:(new Date).toUTCString(),
    LogType
}

Throttld(600)
var count = 0

async function Throttld(burstCount) {

    var burstArray = []
    var residue = data.length % burstCount

    console.log('residue is', residue)
    // Everytime Modulo sum is 0, create burstArray 
    for await (item of data) {

        count++
     
        burstArray.push(item)

        if (count % burstCount == 0) {
            console.log('bursting')
            await PushToAzureLogs(burstArray, laws).catch((error) => console.log(error))
            var burstArray = []
        }   
    }

     // Handle Residuals in single call
    var resid = data.splice((data.length - residue), data.length)
    resid
    if (resid.length > 0) {
        await PushToAzureLogs(resid, laws).catch((error) => console.log(error))
    }
     
}
