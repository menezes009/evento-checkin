const html5QrCode = new Html5Qrcode("reader")

function iniciarScanner(){

Html5Qrcode.getCameras().then(devices => {

let cameraId = devices[0].id

html5QrCode.start(
cameraId,
{
fps:10,
qrbox:250
},
(decodedText)=>{

checkin(decodedText)

},
(errorMessage)=>{}

)

})

}

iniciarScanner()
