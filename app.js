const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let convidados = []

async function carregar(){
let res = await fetch(API)
convidados = await res.json()
}

carregar()

document.getElementById("busca").addEventListener("input", function(){
let termo = this.value.toLowerCase()

let filtrados = convidados.filter(c =>
(c.nome && c.nome.toLowerCase().includes(termo)) ||
(c.codigo && c.codigo.toLowerCase().includes(termo))
)

mostrar(filtrados.slice(0,10))
})

function mostrar(lista){

let div = document.getElementById("resultado")
div.innerHTML=""

lista.forEach(c=>{

let el=document.createElement("div")

el.className="card"

el.innerHTML=`
<b>${c.nome}</b><br>
Código: ${c.codigo}<br>
Entradas: ${c.entradas} / ${c.limite}<br>
<button onclick="checkin('${c.codigo}')">CHECK-IN</button>
`

div.appendChild(el)

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

msg.innerHTML = `
<div style="
background:#27ae60;
color:white;
font-size:40px;
padding:25px;
border-radius:10px;
margin-top:20px;
font-weight:bold;">
✅ Entrada liberada
</div>
`

}

else if(r=="LIMITE"){

msg.innerHTML = `
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

else if(r=="INVALIDO"){

msg.innerHTML = `
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

carregar()

}

function onScanSuccess(decodedText){

checkin(decodedText)

// reinicia scanner após leitura
setTimeout(()=>{
html5QrcodeScanner.clear().then(()=>{
html5QrcodeScanner.render(onScanSuccess)
})
},1500)

}

let html5QrcodeScanner = new Html5QrcodeScanner(
"reader",
{
fps:10,
qrbox:250,
rememberLastUsedCamera:false,
supportedScanTypes:[Html5QrcodeScanType.SCAN_TYPE_CAMERA],
videoConstraints:{
facingMode:"environment"
}
}
)

html5QrcodeScanner.render(onScanSuccess)
