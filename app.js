const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let convidados = []

async function carregar(){

let res = await fetch(API)
let data = await res.json()

convidados = data.lista

document.getElementById("contador").innerText = convidados.length
document.getElementById("checkins").innerText = data.contador

mostrarLista(convidados)

}

function mostrarLista(lista){

let div = document.getElementById("lista")

div.innerHTML = ""

lista.forEach(p=>{

let el = document.createElement("div")
el.className = "item"

el.innerHTML = `

<b>${p.nome}</b><br>

Código: ${p.codigo}<br>

Entradas: ${p.entradas} / ${p.limite}<br><br>

<button onclick="checkin('${p.codigo}')">CHECK-IN</button>

`

div.appendChild(el)

})

}

async function checkin(codigo){

let res = await fetch(API,{

method:"POST",
body:JSON.stringify({codigo:codigo})

})

let r = await res.json()

let msg = document.getElementById("mensagem")

if(r.status=="OK"){

msg.className="liberado"

msg.innerHTML = "✅ "+r.nome+" LIBERADO"

}

else if(r.status=="LIMITE"){

msg.className="bloqueado"

msg.innerHTML = "❌ "+r.nome+" JÁ ENTROU"

}

else{

msg.className="bloqueado"

msg.innerHTML = "❌ QR INVÁLIDO"

}

carregar()

}

function iniciarScanner(){

const html5QrCode = new Html5Qrcode("reader")

html5QrCode.start(

{ facingMode: "environment" },

{

fps:10,
qrbox:250

},

qrCodeMessage => {

checkin(qrCodeMessage)

}

)

}

document.getElementById("busca").addEventListener("input",function(){

let v = this.value.toLowerCase()

let filtrado = convidados.filter(p =>

p.nome.toLowerCase().includes(v) ||

p.codigo.toLowerCase().includes(v)

)

mostrarLista(filtrado)

})

carregar()

iniciarScanner()
