function doGet() {

const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const dados = sheet.getDataRange().getValues();

let convidados=[]
let totalCheckin = 0

for(let i=1;i<dados.length;i++){

let nome = dados[i][1]
let codigo = dados[i][3]
let entradas = dados[i][9] || 0
let limite = dados[i][10] || 1

if(entradas>0) totalCheckin++

if(nome && codigo){

convidados.push({
nome:nome,
codigo:codigo,
entradas:entradas,
limite:limite
})

}

}

return ContentService
.createTextOutput(JSON.stringify({
lista: convidados,
contador: totalCheckin
}))
.setMimeType(ContentService.MimeType.JSON)

}



function doPost(e){

const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()

let codigo = ""

try{

let dados = JSON.parse(e.postData.contents)
codigo = dados.codigo

}catch(err){

codigo = e.parameter.codigo

}

let lista = sheet.getDataRange().getValues()

for(let i=1;i<lista.length;i++){

if(lista[i][3] == codigo){

let nome = lista[i][1]
let limite = lista[i][10] || 1
let entradas = lista[i][9] || 0

if(entradas >= limite){

return ContentService.createTextOutput(JSON.stringify({
status:"LIMITE",
nome:nome
}))
.setMimeType(ContentService.MimeType.JSON)

}

sheet.getRange(i+1,10).setValue(entradas+1)
sheet.getRange(i+1,8).setValue("CHECK-IN")
sheet.getRange(i+1,9).setValue(new Date())

return ContentService.createTextOutput(JSON.stringify({
status:"OK",
nome:nome
}))
.setMimeType(ContentService.MimeType.JSON)

}

}

return ContentService.createTextOutput(JSON.stringify({
status:"INVALIDO"
}))
.setMimeType(ContentService.MimeType.JSON)

}
