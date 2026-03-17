const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let html5QrCode



async function carregar(){

try{

let res = await fetch(API)
let data = await res.json()

if(data.contador !== undefined){
document.getElementById("contador").innerText = data.contador
}

if(data.lista){
mostrarLista(data.lista)
}

}catch(err){

console.log("Erro ao carregar dados", err)

}

}



function mostrarLista(lista){

let div = document.getElementById("lista")
div.innerHTML=""

lista.forEach(function(p){

if(p.entradas > 0){

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
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({codigo:codigo})
})

let r = await res.json()

let msg = document.getElementById("mensagem")



if(r.status=="OK"){

msg.innerHTML = `
<div style="
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:#27ae60;
color:white;
display:flex;
align-items:center;
justify-content:center;
font-size:50px;
font-weight:bold;
text-align:center;
z-index:9999;">
✅ ${r.nome} LIBERADO
</div>
`

setTimeout(()=>{
msg.innerHTML=""
},2500)

}



else if(r.status=="LIMITE"){

msg.innerHTML = `
<div style="
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:#e74c3c;
color:white;
display:flex;
align-items:center;
justify-content:center;
font-size:45px;
font-weight:bold;
text-align:center;
z-index:9999;">
🚫 ${r.nome} JÁ ENTROU
</div>
`

setTimeout(()=>{
msg.innerHTML=""
},2500)

}



else{

msg.innerHTML = `
<div style="
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:#c0392b;
color:white;
display:flex;
align-items:center;
justify-content:center;
font-size:45px;
font-weight:bold;
text-align:center;
z-index:9999;">
QR INVÁLIDO
</div>
`

setTimeout(()=>{
msg.innerHTML=""
},2500)

}

carregar()

}



function iniciarScanner(){

html5QrCode = new Html5Qrcode("reader")

html5QrCode.start(
{ facingMode: "environment" },   // força câmera traseira
{
fps:10,
qrbox:250
},
(decodedText)=>{

checkin(decodedText)

},
(errorMessage)=>{}

)

}



function reiniciarScanner(){

html5QrCode.stop().then(()=>{
iniciarScanner()
})

}



iniciarScanner()



setInterval(carregar,3000)
carregar()
