fetch("LINK_DO_APPS_SCRIPT")
.then(res => res.json())
.then(data => {

let div = document.getElementById("lista")

data.forEach(c =>{

let el = document.createElement("p")

el.innerText = c.nome + " - " + c.status

div.appendChild(el)

})

})