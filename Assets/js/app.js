const serverURL = 'http://localhost:5000';
let kategoria_select = document.querySelector('#inputGroupSelect01');
let termek_select = document.querySelector('#inputGroupSelect02');
let egyseg_price = document.querySelector('#egyseg_ar');
let amount = document.querySelector('#mennyi');
let osszar = document.querySelector('#osszar');
let table = document.querySelector('#asztal');
let gonb = document.querySelector('#gonb');

kategoria_select.addEventListener("change", (event) => {
    axios.get(`${serverURL}/items/cat/"${kategoria_select.value}"`).then(res=>{
        termek_select.innerHTML = ''
        res.data.forEach(item =>{
            let opcio = document.createElement('option');
            opcio.value = item.nev;
            opcio.text = `${item.nev}`;
            termek_select.appendChild(opcio);
        })
    })
});

termek_select.addEventListener("change", (event) => {
    axios.get(`${serverURL}/items/item/"${termek_select.value}"`).then(res=>{
        res.data.forEach(item =>{
            egyseg_price.ariaDisabled = false;
            egyseg_price.value = `${item.ar}`;
            egyseg_price.ariaDisabled = true;
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
    adat5.innerHTML = "";
    sor.appendChild(adat1);
    sor.appendChild(adat2);
    sor.appendChild(adat3);
    sor.appendChild(adat4);
    sor.appendChild(adat5);
    console.log("H");
    table.appendChild(sor);

});
fill_list();