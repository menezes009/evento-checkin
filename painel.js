fetch("https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec")
.then(res => res.json())
.then(data => {

let div = document.getElementById("lista")

data.forEach(c =>{

let el = document.createElement("p")

el.innerText = c.nome + " - " + c.status

div.appendChild(el)

})

})
