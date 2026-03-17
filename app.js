const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let convidados = []

async function carregar(){

let res = await fetch(API)
convidados = await res.json()

mostrar()

}

carregar()

function mostrar(){

let div = document.getElementById("resultado")
div.innerHTML=""

convidados.forEach(c=>{

let status = c.entradas + " / " + c.limite

let el = document.createElement("div")

el.innerHTML = `
<div class="card">
<b>Código:</b> ${c.codigo}<br>
<b>Entradas:</b> ${status}
<br>
<button onclick="checkin('${c.codigo}')">CHECK-IN</button>
</div>
`

div.appendChild(el)

})

}

async function checkin(codigo){

let res = await fetch(API,{
method:"POST",
body:JSON.stringify({codigo:codigo})
})

let r = await res.text()

if(r=="OK"){
alert("Entrada liberada ✅")
}

if(r=="LIMITE"){
alert("Limite de entradas atingido 🚫")
}

if(r=="INVALIDO"){
alert("Código inválido ❌")
}

carregar()

}
function onScanSuccess(decodedText) {

checkin(decodedText)

}

let html5QrcodeScanner = new Html5QrcodeScanner(
"reader",
{ fps: 10, qrbox: 250 }
)

html5QrcodeScanner.render(onScanSuccess)
