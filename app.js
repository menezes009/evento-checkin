const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let convidados = []

async function carregar(){

try{

let res = await fetch(API + "?t=" + new Date().getTime())

let data = await res.json()

convidados = data.lista

document.getElementById("contador").innerText = convidados.length
document.getElementById("checkins").innerText = data.contador

mostrarLista(convidados)

}catch(e){

console.log("Erro API",e)

}

}



function mostrarLista(lista){

let div = document.getElementById("lista")

if(!div) return

div.innerHTML = ""

lista.forEach(p=>{

let el = document.createElement("div")

el.className="item"

el.innerHTML=`

<b>${p.nome}</b><br>
Código: ${p.codigo}<br>
Entradas: ${p.entradas}/${p.limite}<br><br>

<button onclick="checkin('${p.codigo}')">
CHECK-IN
</button>

`

div.appendChild(el)

})

}



async function checkin(codigo){

try{

// envia o código pela URL (compatível com Apps Script)
let res = await fetch(API + "?codigo=" + encodeURIComponent(codigo) + "&t=" + Date.now(),{

method:"POST"

})

let r = await res.json()

let msg = document.getElementById("mensagem")

if(!msg) return

if(r.status=="OK"){

msg.className="liberado"
msg.innerHTML="✅ " + r.nome + " LIBERADO"

}

else if(r.status=="LIMITE"){

msg.className="bloqueado"
msg.innerHTML="❌ " + r.nome + " JÁ ENTROU"

}

else{

msg.className="bloqueado"
msg.innerHTML="❌ QR INVÁLIDO"

}

carregar()

}catch(e){

console.log("Erro checkin",e)

}

}



function iniciarScanner(){

const html5QrCode = new Html5Qrcode("reader")

html5QrCode.start(

{ facingMode: "environment" },

{
fps:10,
qrbox:250
},

(qrCodeMessage)=>{

checkin(qrCodeMessage)

}

).catch(err => {

console.log("Erro câmera",err)

})

}



window.onload = function(){

carregar()

setTimeout(iniciarScanner,500)

}
