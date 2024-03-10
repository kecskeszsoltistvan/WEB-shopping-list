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
let osszar_szamolo = document.querySelector('#osszar_szamolo');

function getColumn(col) {
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

function osszar_szamolas(){
    osszar_szamolo.innerHTML = `Összár: ${getColumn(3)}ft`;
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
                egyseg_price.ariaDisabled = false;
                egyseg_price.value = `${targy.ar}`;
                egyseg_price.ariaDisabled = true;
                osszar.value = amount.value * targy.ar;
                
            })
        })
    })
});

termek_select.addEventListener("change", (event) => {
    axios.get(`${serverURL}/items/item/"${termek_select.value}"`).then(res=>{
        res.data.forEach(item =>{
            egyseg_price.ariaDisabled = false;
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

gonb.addEventListener("click", (event) => { 
    if (amount.value != "" && egyseg_price.value != "" && osszar.value != "" || amount.value < 1){
        let sor = document.createElement('tr');
        let adat1 = document.createElement('th');
        let adat2 = document.createElement('th');
        let adat3 = document.createElement('th');
        let adat4 = document.createElement('th');
        let adat5 = document.createElement('th');
        adat1.innerHTML = termek_select.value;
        adat2.innerHTML = amount.value;
        adat3.innerHTML = egyseg_price.value;
        adat4.innerHTML = osszar.value;
        let t_g = document.createElement('button');
        t_g.setAttribute("class", "delete");
        t_g.innerHTML = "X";
        t_g.setAttribute("onClick", "osszar_szamolas(); return this.parentNode.parentNode.remove();")
        adat5.appendChild(t_g)
        sor.appendChild(adat1);
        sor.appendChild(adat2);
        sor.appendChild(adat3);
        sor.appendChild(adat4);
        sor.appendChild(adat5);
        table.appendChild(sor);
    }
    else{
        alert("Nincs meg minden adat vagy rosszul.");
    }
    osszar_szamolas()
});
fill_list();