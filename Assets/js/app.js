const serverURL = 'http://localhost:5000';
let kategoria_select = document.querySelector('#inputGroupSelect01');
let termek_select = document.querySelector('#inputGroupSelect02');
let egyseg_price = document.querySelector('#egyseg_ar');
let amount = document.querySelector('#mennyi');
let osszar = document.querySelector('#osszar');
let table = document.querySelector('#asztal');
let gonb = document.querySelector('#gonb');
let mentes = document.querySelector('#gonb2');
let torles = document.querySelector('#gonb3');
let nemtom = document.querySelector('#gonb4');
let inport = document.querySelector('#import');
let osszar_szamolo = document.querySelector('#osszar_szamolo');

function getColumnSum(col) {
    let tab = table;
    let n = tab.rows.length;
    let i = 0;
    let s = 0;
    if (col < 0) {
        return null;
    }

    for (i = 1; i < n; i++) {
        tr = tab.rows[i];
        if (tr.cells.length > col) { 
            td = tr.cells[col];
            s += Number(td.innerText);
        } 
    }
    return s;
}
function getColumn(col) {
    let tab = table;
    let n = tab.rows.length;
    let i = 0;
    let s = [];
    if (col < 0) {
        return null;
    }

    for (i = 1; i < n; i++) {
        tr = tab.rows[i];
        if (tr.cells.length > col) { 
            td = tr.cells[col];
            s.push(td.innerText);
        } 
    }
    return s;
}
function getRowOfItemInColumn(item, col) {
    let tab = table;
    let n = tab.rows.length;
    let i = 0;
    if (col < 0) {
        return null;
    }

    for (i = 1; i < n; i++) {
        tr = tab.rows[i];
        if (tr.cells.length > col) { 
            td = tr.cells[col];
            if (td.innerText == item) {
                return i;
            }
        } 
    }
    return -1;
}

function osszar_szamolas(){
    osszar_szamolo.innerHTML = `Összár: ${getColumnSum(3)}ft`;
}

table.querySelectorAll('button').forEach(btn => btn.addEventListener("click", function(e){
    this.parentNode.remove();
}));

if (localStorage.getItem("Tartalom") != null){
    table.innerHTML = localStorage.getItem("Tartalom");
    osszar_szamolas();
}

mentes.addEventListener("click", (event) => {
    localStorage.setItem("Tartalom", table.innerHTML);
    osszar_szamolas()
})

torles.addEventListener("click", (event) => {
    if (confirm("Biztosan kitörli a jelenlegi lista tartalmát?"))
    {
        localStorage.removeItem("Tartalom");
        table.innerHTML = `<thead id="asztal">
        <tr>
          <th scope="col">Terméknév</th>
          <th scope="col">Mennyiség</th>
          <th scope="col">Egységár</th>
          <th scope="col">Összesen</th>
          <th scope="col">Műveletek</th>
        </tr>
      </thead>`;
    }

})

kategoria_select.addEventListener("change", (event) => {
        termek_select.disabled = false;
    axios.get(`${serverURL}/items/cat/"${kategoria_select.value}"`).then(res=>{
        termek_select.innerHTML = ''
        res.data.forEach(item =>{
            let opcio = document.createElement('option');
            opcio.value = item.nev;
            opcio.text = `${item.nev}`;
            termek_select.appendChild(opcio);
        })
        termek_select.selectedIndex = 0;
        axios.get(`${serverURL}/items/item/"${termek_select[termek_select.selectedIndex].value}"`).then(res=>{
            res.data.forEach(targy => {
                egyseg_price.ariadisabled = false;
                egyseg_price.value = `${targy.ar}`;
                egyseg_price.ariaDisabled = true;
                amount.value = 1;
                osszar.value = amount.value * targy.ar;
                
            })
        })
    })
});

termek_select.addEventListener("change", (event) => {
    amount.disabled = false;
    axios.get(`${serverURL}/items/item/"${termek_select.value}"`).then(res=>{
        res.data.forEach(item =>{
            egyseg_price.ariaDisabled = false;
            amount.value = 1;
            egyseg_price.value = `${item.ar}`;
            egyseg_price.ariaDisabled = true;
            osszar.value = amount.value * item.ar;
        })
    })
});

mennyi.addEventListener("change", (event) => {
    axios.get(`${serverURL}/items/item/"${termek_select.value}"`).then(res=>{
        res.data.forEach(item =>{
            osszar.value = amount.value * item.ar;
        })
    })
});

function fill_list(){
    setTimeout(()=>{
        axios.get(`${serverURL}/categories`).then(res=>{
            res.data.forEach(item =>{
                let opcio = document.createElement('option');
                opcio.value = item.kategoria;
                opcio.text = item.kategoria;
                kategoria_select.appendChild(opcio);
            })
        })
    }, 500);
}

function tableContent(){
    let s = "";
    for (let index = 1; index < table.rows.length; index++) {
        s += `<tr>${table.rows[index].innerHTML}</tr>`;
    }
    return s;
}

// Importálás
inport.addEventListener("click", (event) => {
    var input = document.createElement('input');
input.type = 'file';
input.setAttribute("accept", ".📋");
input.onchange = e => { 

   var file = e.target.files[0]; 

   // Olvasó
   var reader = new FileReader();
   reader.readAsText(file,'UTF-8');

   // Mikor vége az olvasásnak
   reader.onload = readerEvent => {
      var content = readerEvent.target.result; // A tartalma
      table.innerHTML = `<thead id="asztal"><tr><th scope="col">Terméknév</th><th scope="col">Mennyiség</th><th scope="col">Egységár</th><th scope="col">Összesen</th><th scope="col">Műveletek</th></tr></thead>${content}`;
      localStorage.setItem("Tartalom", table.innerHTML);
      osszar_szamolas()
    }

}

input.click();
})
// Exportálás
function createFile(){
    //create or obtain the file's content
    let content = tableContent();
  
    //create a file and put the content, name and type
    let file = new File(["\ufeff"+content], 'Bevasarlolista.📋', {type: "text/plain:charset=UTF-8"});
  
    //create a ObjectURL in order to download the created file
    url = window.URL.createObjectURL(file);
  
    //create a hidden link and set the href and click it
    let a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = file.name;
    a.click();
    window.URL.revokeObjectURL(url);
  } 

function torles_muvelet(){
    osszar_szamolas();  
}

gonb.addEventListener("click", (event) => { 
    if (amount.value != "" && egyseg_price.value != "" && osszar.value != "" || amount.value < 1){
        if(getColumn(0).includes(termek_select.value)){
            console.log(getRowOfItemInColumn(termek_select.value, 0));
            table.rows[getRowOfItemInColumn(termek_select.value, 0)].cells[1].innerText = amount.value;
            table.rows[getRowOfItemInColumn(termek_select.value, 0)].cells[3].innerText = table.rows[getRowOfItemInColumn(termek_select.value, 0)].cells[1].innerText * table.rows[getRowOfItemInColumn(termek_select.value, 0)].cells[2].innerText;

        }
        else{
            let sor = document.createElement('tr');
            let adat1 = document.createElement('td');
            let adat2 = document.createElement('td');
            let adat3 = document.createElement('td');
            let adat4 = document.createElement('td');
            let adat5 = document.createElement('td');
            adat1.innerHTML = termek_select.value;
            adat2.innerHTML = amount.value;
            adat3.innerHTML = egyseg_price.value;
            adat4.innerHTML = osszar.value;
            let t_g = document.createElement('button');
            t_g.setAttribute("class", "delete");
            t_g.innerHTML = "X";
            t_g.setAttribute("onClick", "return this.parentNode.parentNode.remove();")
            t_g.addEventListener("click", (event) =>{
                osszar_szamolas();
            })
            adat5.appendChild(t_g)
            sor.appendChild(adat1);
            sor.appendChild(adat2);
            sor.appendChild(adat3);
            sor.appendChild(adat4);
            sor.appendChild(adat5);
            table.appendChild(sor);
        }
    }
    else{
        alert("Nincs meg minden adat vagy rosszul.");
    }
    osszar_szamolas()
});
fill_list();