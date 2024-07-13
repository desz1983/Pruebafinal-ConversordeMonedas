const selectIndicador = document.getElementById('indicadores');
const msgError = document.getElementById('error');
const msgErrorTry = document.getElementById('errorTry');
const btnCalcular = document.getElementById('btnCalcular');

let myLineChart;


async function calculaConversion(indicador, inputMonto) {
    
try{
    const spanResultado = document.getElementById('resultado');
    const apiURL = 'https://mindicador.cl/api/' + indicador;
    const res = await fetch(apiURL);
    const datos = await res.json();
    const resultado = inputMonto / datos.serie[0].valor;
    spanResultado.innerHTML = `
    <div class="box">
        <p><strong>Valor ${indicador} actual:</strong> ${datos.serie[0].valor}</p>
        <p><strong>${inputMonto} CLP equivalen a: ${resultado.toFixed(2)}</strong> ${indicador}</p>
 </div>
    `;
    return datos;
}catch(e){
    msgErrorTry.innerHTML = `<div class="notification is-danger">Ha ocurrido un error: ${e}</div>`;
}

}

async function renderGrafica(indicador,inputMonto) {

        const datos = await calculaConversion(indicador, inputMonto);
        const config = confGrafico(datos, indicador);
        const canva = document.querySelector(".grafica");
        canva.style.display = 'block';
        if (myLineChart) {
            myLineChart.destroy();
        }
        const chartDOM = document.getElementById("myChart");
        myLineChart = new Chart(chartDOM, config);

}

function convertirFecha(fecha) {
    const fechaUTC = new Date(fecha);
    const fechaFormateadaChile = new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'short',
        timeZone: 'America/Santiago'
    }).format(fechaUTC);
    return fechaFormateadaChile;
}

const confGrafico = (datos, indicador) => {
    const fechas = [];
    const valores = [];
    for (let count = 0; count < 10; count++) {
        fechas.unshift(convertirFecha(datos.serie[count].fecha));
        valores.unshift(datos.serie[count].valor);
    }

    const config = {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [
                {
                    label: 'Valor ' + indicador + ' últimos 10 días',
                    backgroundColor: 'red',
                    data: valores
                }
            ]
        }
    };
    return config;
};


function onlyNumberKey(evt) {
    let ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}

btnCalcular.addEventListener('click', (e) => {
    const selectIndicador = document.getElementById('indicadores').value;
    const inputMonto = document.getElementById('monto').value.replace(/\./g, '');
    document.getElementById('monto').value = inputMonto;
    
    let montoValor = inputMonto.trim();
    if (montoValor === '' || montoValor === 0) {
        msgError.innerHTML = `<div class="notification is-danger">Tienes que ingresar un valor.</div>`;
        document.getElementById('monto').style.backgroundColor = 'red';         
        document.getElementById('monto').style.color = 'white';

        
    } else {
        msgError.innerHTML = '';
        document.getElementById('monto').style.backgroundColor = '';
        document.getElementById('monto').style.color = '';
        renderGrafica(selectIndicador, inputMonto);
    }
    
});

