const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let convidados = []

const somOk = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg")
const somErro = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg")

async function carregar(){

try{

let res = await fetch(API + "?t=" + new Date().getTime())
let data = await res.json()

convidados = data.lista

document.getElementById("contador").innerText = convidados.length
document.getElementById("checkins").innerText = data.contador

mostrarEntradas(convidados)

}catch(e){

console.log("Erro API",e)

}

}



function mostrarLista(lista){

let div = document.getElementById("lista")

if(!div) return

div.innerHTML = ""

if(lista.length == 0){

div.innerHTML = "<p>Nenhum convidado encontrado</p>"
return

}

lista.forEach(p=>{

let el = document.createElement("div")

el.className="item"

el.innerHTML=`

<b>${p.nome}</b><br>
Código: ${p.codigo}<br>
Entradas: ${p.entradas}/${p.limite}<br><br>

${p.entradas >= p.limite 
? `<div class="jaentrou">✔ Já entrou</div>` 
: `<button onclick="checkin('${p.codigo}')">CHECK-IN</button>`}

`

div.appendChild(el)

})

}



function mostrarEntradas(lista){

let div = document.getElementById("entradas")

if(!div) return

div.innerHTML = ""

lista
.filter(p => p.entradas > 0)
.reverse()
.forEach(p=>{

let el = document.createElement("div")

el.className="entrada"

el.innerHTML = "✔ " + p.nome

div.appendChild(el)

})

}



async function checkin(codigo){

try{

let res = await fetch(API + "?codigo=" + encodeURIComponent(codigo) + "&t=" + Date.now(),{

method:"POST"

})

let r = await res.json()

let msg = document.getElementById("mensagem")

if(!msg) return

if(r.status=="OK"){

somOk.play()

msg.className="liberado"
msg.innerHTML="✅ " + r.nome + " LIBERADO"

}

else if(r.status=="LIMITE"){

somErro.play()

msg.className="bloqueado"
msg.innerHTML="❌ " + r.nome + " JÁ ENTROU"

}

else{

somErro.play()

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



document.getElementById("busca").addEventListener("input", function(){

let termo = this.value.toLowerCase()

if(termo.length < 2){

document.getElementById("lista").innerHTML = ""
return

}

let filtrados = convidados.filter(p =>

p.nome.toLowerCase().includes(termo) ||
p.codigo.toLowerCase().includes(termo)

)

mostrarLista(filtrados)

})



window.onload = function(){

carregar()

setTimeout(iniciarScanner,500)

setInterval(carregar,5000)

}
