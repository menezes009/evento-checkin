let convidados = []

fetch("data.json")
.then(res => res.json())
.then(data => {
convidados = data
})

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

lista.forEach(c =>{

let el = document.createElement("div")

el.innerHTML = `
<b>${c.nome}</b>
<button onclick="checkin('${c.codigo}')">Check-in</button>
`

div.appendChild(el)

})

}

function checkin(codigo){

fetch("https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec",{
method:"POST",
body:JSON.stringify({codigo})
})

alert("Check-in realizado")

}
