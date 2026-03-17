const API="https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let convidados=[]
let scanner
let ultimo=null



async function carregar(){

let res=await fetch(API)
let data=await res.json()

convidados=data.lista

let total=convidados.filter(c=>c.entradas>0).length

document.getElementById("contador").innerText=total

}

carregar()



// BUSCA

document.getElementById("busca").addEventListener("input",function(){

let termo=this.value.toLowerCase()

let lista=convidados.filter(c=>
(c.nome&&c.nome.toLowerCase().includes(termo))||
(c.codigo&&c.codigo.toLowerCase().includes(termo))
)

mostrar(lista.slice(0,10))

})



function mostrar(lista){

let div=document.getElementById("resultado")

div.innerHTML=""

lista.forEach(c=>{

let el=document.createElement("div")

el.className="card"

el.innerHTML=`
<b>${c.nome}</b><br>
Código: ${c.codigo}<br>
Entradas: ${c.entradas} / ${c.limite}<br>
<button onclick="checkin('${c.codigo}')">CHECK-IN</button>
`

div.appendChild(el)

})

}



// CHECKIN

async function checkin(codigo){

let res=await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({codigo:codigo})
})

let r=await res.json()

let msg=document.getElementById("mensagem")

if(r.status=="OK"){

document.getElementById("ok").play()

msg.innerHTML=`
<div class="liberado">
LIBERADO<br>
${r.nome}
</div>
`

}

else if(r.status=="LIMITE"){

document.getElementById("erro").play()

msg.innerHTML=`
<div class="bloqueado">
JÁ ENTROU<br>
${r.nome}
</div>
`

}

else{

msg.innerHTML=`<div class="bloqueado">QR INVÁLIDO</div>`

}

carregar()

}



// SCANNER

function iniciarScanner(){

scanner=new Html5Qrcode("reader")

Html5Qrcode.getCameras().then(cameras=>{

let traseira=cameras.find(c=>
c.label.toLowerCase().includes("back")||
c.label.toLowerCase().includes("rear")||
c.label.toLowerCase().includes("traseira")
)

let id=traseira?traseira.id:cameras[cameras.length-1].id

scanner.start(
id,
{
fps:15,
qrbox:{width:250,height:250}
},
(decodedText)=>{

if(decodedText==ultimo)return

ultimo=decodedText

checkin(decodedText)

setTimeout(()=>{
ultimo=null
},2000)

},
(err)=>{}

)

})

}

iniciarScanner()



setInterval(carregar,5000)
