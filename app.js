const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let convidados = []

async function carregar(){

let res = await fetch(API)
let data = await res.json()

convidados = data.lista

let total = convidados.filter(c => c.entradas > 0).length

document.getElementById("contador").innerText = total

}

carregar()



// BUSCA

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



// CHECKIN

async function checkin(codigo){

let res = await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({codigo:codigo})
})

let r = await res.json()

let msg = document.getElementById("mensagem")

if(r.status == "OK"){

msg.innerHTML=`
<div style="
background:#27ae60;
color:white;
font-size:34px;
padding:25px;
border-radius:12px;
margin-top:20px;
font-weight:bold;">
✅ ${r.nome} LIBERADO
</div>
`

}

else if(r.status == "LIMITE"){

msg.innerHTML=`
<div style="
background:#e74c3c;
color:white;
font-size:34px;
padding:25px;
border-radius:12px;
margin-top:20px;
font-weight:bold;">
🚫 ${r.nome} JÁ ENTROU
</div>
`

}

else{

msg.innerHTML=`
<div style="
background:#c0392b;
color:white;
font-size:34px;
padding:25px;
border-radius:12px;
margin-top:20px;
font-weight:bold;">
QR INVÁLIDO
</div>
`

}

carregar()

}



// SCANNER QR

function iniciarScanner(){

const html5QrCode = new Html5Qrcode("reader")

Html5Qrcode.getCameras().then(cameras => {

if(!cameras.length){
alert("Nenhuma câmera encontrada")
return
}

// força câmera traseira
let traseira = cameras.find(c =>
c.label.toLowerCase().includes("back") ||
c.label.toLowerCase().includes("traseira")
)

let camera = traseira ? traseira.id : cameras[0].id

html5QrCode.start(
camera,
{
fps:10,
qrbox:250
},
(decodedText)=>{

checkin(decodedText)

},
(error)=>{}

)

})

}

iniciarScanner()



// ATUALIZA CONTADOR AUTOMATICAMENTE

setInterval(carregar,5000)
