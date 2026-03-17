const API = "https://script.google.com/macros/s/AKfycbwhdLjEQouDWwfLYCbEPW-cledqSNPf9oooZMOSOqb2viMRoTxlgFA_D6eBgXB-rlYN/exec"

let convidados = []

async function carregar(){
  const res = await fetch(API)
  const data = await res.json()

  convidados = data.lista || []

  const total = convidados.filter(c => (c.entradas || 0) > 0).length
  const contador = document.getElementById("contador")
  if (contador) contador.innerText = total
}

carregar()



// BUSCA
const busca = document.getElementById("busca")
if (busca){
  busca.addEventListener("input", function(){
    const termo = this.value.toLowerCase()

    const filtrados = convidados.filter(c =>
      (c.nome && c.nome.toLowerCase().includes(termo)) ||
      (c.codigo && c.codigo.toLowerCase().includes(termo))
    )

    mostrar(filtrados.slice(0,10))
  })
}



function mostrar(lista){
  const div = document.getElementById("resultado")
  if (!div) return

  div.innerHTML=""

  lista.forEach(c=>{
    const el=document.createElement("div")
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
  try{

    const res = await fetch(API,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({codigo: codigo})
    })

    const r = await res.json()

    const msg = document.getElementById("mensagem")

    if(r.status === "OK"){
      msg.innerHTML = `
      <div style="background:#27ae60;color:white;font-size:32px;padding:25px;border-radius:12px;margin-top:20px;">
        ✅ ${r.nome} LIBERADO
      </div>`
    }

    else if(r.status === "LIMITE"){
      msg.innerHTML = `
      <div style="background:#e74c3c;color:white;font-size:32px;padding:25px;border-radius:12px;margin-top:20px;">
        🚫 ${r.nome} JÁ ENTROU
      </div>`
    }

    else{
      msg.innerHTML = `
      <div style="background:#c0392b;color:white;font-size:32px;padding:25px;border-radius:12px;margin-top:20px;">
        QR INVÁLIDO
      </div>`
    }

    carregar()

  }catch(e){
    console.error("Erro no checkin:", e)
  }
}



// SCANNER QR
function iniciarScanner(){

  const html5QrCode = new Html5Qrcode("reader")

  Html5Qrcode.getCameras().then(cameras => {

    if(!cameras.length){
      alert("Nenhuma câmera encontrada")
      return
    }

    const traseira = cameras.find(c =>
      c.label.toLowerCase().includes("back") ||
      c.label.toLowerCase().includes("traseira")
    )

    const camera = traseira ? traseira.id : cameras[0].id

    html5QrCode.start(
      camera,
      {
        fps:10,
        qrbox:250
      },
      (decodedText)=>{
        checkin(decodedText)
      },
      (error)=>{}
    )

  })
}

iniciarScanner()



// atualiza contador automaticamente
setInterval(carregar,5000)
