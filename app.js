
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

function mostrarLista(lista){

let div = document.getElementById("lista")
div.innerHTML=""

lista.forEach(p=>{

if(p.entradas>0){

let el = document.createElement("div")

el.innerHTML = `
✔ ${p.nome}
`

div.appendChild(el)

}

})

}

async function checkin(codigo){

let res = await fetch(API,{
method:"POST",
body:JSON.stringify({codigo})
})

let r = await res.json()

let msg = document.getElementById("mensagem")

if(r.status=="OK"){

msg.innerHTML = `
<div class="liberado">
✅ ${r.nome} LIBERADO
</div>
`

}

if(r.status=="LIMITE"){

msg.innerHTML = `
<div class="bloqueado">
🚫 ${r.nome} JÁ ENTROU
</div>
`

}

if(r.status=="INVALIDO"){

msg.innerHTML = `
<div class="bloqueado">
QR INVÁLIDO
</div>
`

}

}
