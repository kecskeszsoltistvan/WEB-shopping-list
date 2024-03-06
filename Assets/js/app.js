const serverURL = 'http://localhost:5000';
let kategoria_select = document.querySelector('#inputGroupSelect01');
let termek_select = document.querySelector('#inputGroupSelect02');
let egyseg_price = document.querySelector('#egyseg_ar');

kategoria_select.addEventListener("change", (event) => {
    console.log(kategoria_select.value);
    axios.get(`${serverURL}/items/cat/"${kategoria_select.value}"`).then(res=>{
        termek_select.innerHTML = ''
        res.data.forEach(item =>{
            console.log(item.nev);
            let opcio = document.createElement('option');
            opcio.value = item.nev;
            opcio.text = `${item.nev}`;
            termek_select.appendChild(opcio);
        })
    })
});

termek_select.addEventListener("change", (event) => {
    console.log(termek_select.value);
    axios.get(`${serverURL}/items/item/"${termek_select.value}"`).then(res=>{
        res.data.forEach(item =>{
            egyseg_price.ariaDisabled = false;
            egyseg_price.value = `${item.ar}`;
            egyseg_price.ariaDisabled = true;
        })
    })
});


function fill_list(){
    setTimeout(()=>{

        let tipus = document.querySelector('#inputGroupSelect01');
        axios.get(`${serverURL}/categories`).then(res=>{
            res.data.forEach(item =>{
                let opcio = document.createElement('option');
                opcio.value = item.kategoria;
                opcio.text = item.kategoria;
                tipus.appendChild(opcio);
            })
        })
    }, 500);
}
function addItems(){ 
    let kategoria = document.querySelector('#inputGroupSelect01');
    let targy = document.querySelector('#inputGroupSelect02');
    let mennyiseg = document.querySelector('#items');
}
fill_list()