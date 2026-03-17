const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let html5QrCode

function iniciarScanner(){

html5QrCode = new Html5Qrcode("reader")

Html5Qrcode.getCameras().then(devices => {

if(!devices.length){
alert("Nenhuma câmera encontrada")
return
}

// tenta encontrar câmera traseira
let cameraId = devices[0].id

devices.forEach(cam => {

let label = cam.label.toLowerCase()

if(
label.includes("back") ||
label.includes("rear") ||
label.includes("traseira") ||
label.includes("environment")
){
cameraId = cam.id
}

})

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



async function checkin(codigo){

let res = await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({codigo:codigo})
})

let r = await res.text()

let msg = document.getElementById("mensagem")

if(r=="OK"){

msg.innerHTML=`
<div style="
background:#27ae60;
color:white;
font-size:35px;
padding:25px;
border-radius:10px;
margin-top:20px;
font-weight:bold;">
✅ Entrada liberada
</div>
`

}

else if(r=="LIMITE"){

msg.innerHTML=`
<div style="
background:#e74c3c;
color:white;
font-size:35px;
padding:25px;
border-radius:10px;
margin-top:20px;
font-weight:bold;">
🚫 Já entrou
</div>
`

}

else{

msg.innerHTML=`
<div style="
background:#c0392b;
color:white;
font-size:35px;
padding:25px;
border-radius:10px;
margin-top:20px;
font-weight:bold;">
QR inválido
</div>
`

}

}



iniciarScanner()
