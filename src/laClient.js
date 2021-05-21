//https://nodejs.org/api/crypto.html
//https://docs.microsoft.com/en-us/azure/azure-monitor/platform/data-collector-api
//https://stackoverflow.com/questions/44532530/encoding-encrypting-the-azure-log-analytics-authorization-header-in-node-js

const { default: axios } = require('axios')
const crypto = require('crypto')


function PushToAzureLogs (content,options) {
  /*   console.log(id) */
  var {id,key,rfc1123date,LogType} = options
  return new Promise ((resolve,reject) =>{
  
    try {
        //Checking if the data can be parsed as JSON
        if ( JSON.parse(JSON.stringify(content)) ) {

            var length = Buffer.byteLength(JSON.stringify(content),'utf8')
            var binaryKey = Buffer.from(key,'base64')
            var stringToSign = 'POST\n' + length + '\napplication/json\nx-ms-date:' + rfc1123date + '\n/api/logs';
            //console.log(stringToSign)
    
            var hash = crypto.createHmac('sha256',binaryKey)
            .update(stringToSign,'utf8')
            .digest('base64')
            var authorization = "SharedKey "+id +":"+hash
           /*  require('fs').appendFileSync('key.txt', (hash + "\n")) */
            var options= {
                method:"post",
                url:"https://"+ id + ".ods.opinsights.azure.com/api/logs?api-version=2016-04-01",
            json:true,
            headers:{
            "content-type": "application/json", 
            "authorization":authorization,
            "Log-Type":LogType,
            "x-ms-date":rfc1123date,
            "time-generated-field":"DateValue"
            },
            data:content    
            }

       
            axios(options).then((data) => {
                return resolve(data?.statusText || data?.statusCode)
            }).catch((error) => {
                return reject(error?.statusText || error?.statusCode)
            })
               

        }
        //Catch error if data cant be parsed as JSON
    } catch (err) {

        return reject('no data sent to LA')
    }

  })

           
}


module.exports={PushToAzureLogs}




