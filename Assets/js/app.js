const serverURL = 'http://localhost:5000';
let kategoria_select = document.querySelector('#inputGroupSelect01');

kategoria_select.addEventListener("change", (event) => {
    console.log(kategoria_select.value);
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