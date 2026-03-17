const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let convidados = []

async function carregarConvidados(){

let res = await fetch(API + "?lista=1")

convidados = await res.json()

}

carregarConvidados()

document.getElementById("busca").addEventListener("input", function(){

let termo = this.value.toLowerCase()

let filtrados = convidados.filter(c =>
c.nome.toLowerCase().includes(termo)
)

mostrarResultados(filtrados)

})

function mostrarResultados(lista){

let div = document.getElementById("resultado")

div.innerHTML=""

lista.slice(0,10).forEach(c =>{

let el = document.createElement("div")

el.innerHTML = `
<div class="card">
<b>${c.nome}</b>
<br>
<button onclick="checkin('${c.codigo}')">Check-in</button>
</div>
`

div.appendChild(el)

})

}

async function checkin(codigo){

let res = await fetch(API,{
method:"POST",
body:JSON.stringify({codigo})
})

let resposta = await res.text()

alert(resposta)

}
