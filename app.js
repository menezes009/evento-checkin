const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let convidados = []
let scanner



async function carregar(){

let res = await fetch(API)
let data = await res.json()

convidados = data.lista || data

let checkins = convidados.filter(c => (c.entradas || 0) > 0).length

document.getElementById("contador").innerText = checkins

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
Entradas: ${c.entradas || 0} / ${c.limite}<br>
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

msg.innerHTML=`
<div style="
background:#27ae60;
color:white;
font-size:30px;
padding:20px;
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
font-size:30px;
padding:20px;
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
font-size:30px;
padding:20px;
border-radius:10px;
margin-top:20px;
font-weight:bold;">
QR inválido
</div>
`

}

carregar()

}



// SCANNER ESTÁVEL

function iniciarScanner(){

scanner = new Html5Qrcode("reader")

Html5Qrcode.getCameras().then(cameras => {

if(!cameras.length){
alert("Nenhuma câmera encontrada")
return
}

// pega câmera traseira
let camera = cameras.find(c => c.label.toLowerCase().includes("back")) || cameras[0]

scanner.start(
camera.id,
{
fps:15,
qrbox:250
},
(decodedText) => {

checkin(decodedText)

},
(error) => {}

)

})

}

iniciarScanner()



// atualiza contador
setInterval(carregar,5000)
