
const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

async function carregar(){

let res = await fetch(API)
let data = await res.json()

if(data.contador !== undefined){
document.getElementById("contador").innerText = data.contador
}

if(data.lista){
mostrarLista(data.lista)
}

}

function mostrarLista(lista){

let div = document.getElementById("lista")
div.innerHTML=""

lista.forEach(function(p){

if(p.entradas>0){

let el = document.createElement("div")
el.className="item"
el.innerHTML="✔ " + p.nome

div.appendChild(el)

}

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

msg.innerHTML='<div class="liberado">✅ ' + r.nome + ' LIBERADO</div>'

}

else if(r.status=="LIMITE"){

msg.innerHTML='<div class="bloqueado">🚫 ' + r.nome + ' JÁ ENTROU</div>'

}

else{

msg.innerHTML='<div class="bloqueado">QR INVÁLIDO</div>'

}

carregar()

}

function onScanSuccess(decodedText){
checkin(decodedText)
}

let html5QrcodeScanner = new Html5QrcodeScanner(
"reader",
{ fps: 10, qrbox: 250 }
)

html5QrcodeScanner.render(onScanSuccess)

setInterval(carregar,5000)

carregar()
