// Recupero los datos del carrito guardados en el Local Storage
let carrito = JSON.parse(localStorage.getItem("carrito"));
if (!Array.isArray(carrito))
  carrito = [];

// Recupero los datos de los pasajeros guardados en el Local Storage
let txtPasajeros = document.getElementById("pasajeros");
let auxPasajeros = localStorage.getItem("pasajeros");
if (auxPasajeros == null)
    auxPasajeros = txtPasajeros.value
else
    txtPasajeros.value = auxPasajeros;

// Recupero los datos de las cuotas guardados en el Local Storage
let cboCuotas = document.getElementById("cuotas");
let auxCuotas = localStorage.getItem("cuotas");
if (auxCuotas == null)
    auxCuotas = cboCuotas.value
else
    cboCuotas.value = auxCuotas;

// Funcion para mostrar mensajes en pantalla utilizando SweetAlert
// Parametros de Entrada
// mensaje: Contiene el mensaje a mostrar en pantalla
// icono: Icono a mostrar en el mensaje, puede ser success o warning
function mostrarMensaje1(mensaje, icono) {
    Swal.fire({html: mensaje,
               icon: icono,
               width:'35rem',
               confirmButtonText: `Aceptar`,
               timer: '2500'
    });
}

// Funcion para mostrar mensaje de pago utilizando SweetAlert y luego redirige a la pagina principal
// Parametros de Entrada
// mensaje: Contiene el mensaje a mostrar en pantalla
// icono: Icono a mostrar en el mensaje, puede ser success o warning
function mostrarMensaje2(mensaje, icono) {
    Swal.fire({text: mensaje,
               icon: 'success',
               width:'30rem',
               confirmButtonText: `Aceptar`,
            }).then(result => {
                if (result.value) {
                    vaciarCarrito();
                    location.href="index.html"
                }
    })
}

// Obtengo la financiacion segun la cantidad de cuotas
// Parametro de Entrada
// cuotas: Contiene el numero de cuotas para el que se desea obtener el costo de financiacion.
function obtenerFinanciacion(cuotas) {
    let porcentaje;
    if (cuotas <= 2)
        porcentaje = 0;
    else
        if (cuotas > 2 && cuotas <= 6)
             porcentaje = 20;
        else
            if (cuotas > 6 && cuotas <= 9)
                porcentaje = 40;
            else
                if (cuotas > 9 && cuotas <= 12)
                    porcentaje = 60;
                else
                    porcentaje = 100;
    return porcentaje;
}

// Obtengo la financiacion segun la cantidad de cuotas
// Parametros de Entrada
// cuotas: Contiene el numero de cuotas para el que se desea obtener el recargo por financiacion.
// monto: Contiene el monto al que se le aplicara el recargo
function aplicarRecargo(monto, cuotas) {
    let porcentaje = obtenerFinanciacion(cuotas);
    let resultado = monto + (monto * porcentaje / 100);
    return resultado;
}

// Funcion utilizada para aplicar descuento por pasajero adicional
// Parametros de Entrada
// personas: Contiene el numero de personas que participaran del destino turistico elegido
// monto: Contiene el monto al que se le aplicara el descuento
function aplicarDescuento(monto, personas) {
    let preciodto = monto;
    if (personas > 4)
        personas = 4;
    if (personas > 1)
        preciodto -= monto * (5 * personas) / 100;
    return preciodto;
}

// Actualizo el Carrito
function actualizarCarrito() {
    let pasajeros = document.getElementById("pasajeros").value;
    if (pasajeros < 1 || pasajeros > 20) {
        pasajeros = 1;
        let txtPasajeros = document.getElementById("pasajeros");
        txtPasajeros.value = pasajeros;
        localStorage.setItem("pasajeros",pasajeros);
        mostrarMensaje1("La cantidad de Pasajeros debe estar entre 1 y 20","warning")
    }
    let cuotas = document.getElementById("cuotas").value;
    
    // Persisto la cantidad de Pasajeros y Cuotas en el Local Storage
    localStorage.setItem("pasajeros",pasajeros);
    localStorage.setItem("cuotas",cuotas);

    let total = 0;
    let index = 0;
    for (let element of carrito) {
        document.getElementById("tablePrecioTotal" + index).innerText = element.precio * pasajeros;

        // Aplico descuento por pasajero adicional
        let auxPrecioFinal = aplicarDescuento(element.precio,pasajeros) * pasajeros;
        // Aplico comisiones por financiacion
        auxPrecioFinal = aplicarRecargo(auxPrecioFinal,cuotas);
        document.getElementById("tablePrecioFinal" + index).innerText = parseInt(auxPrecioFinal);
    
        // Asigno el Total
        total += parseInt(auxPrecioFinal);
        
        // Itero entre los objetos del array
        index++;
    }
    // Actualizo Total
    document.getElementById("tableTotal").innerText = parseInt(total);

    // Muestro los descuentos y recargos
    let porcentaje = obtenerFinanciacion(cuotas);
    let auxParrafo = document.getElementById("parrafo");
    auxParrafo.innerHTML = `(*1) Descuento del 5% por pasajero adicional (hasta un máximo de 4 pasajeros)<br>(*2) CFT - Costo Financiero Total en ${cuotas} cuota(s): ${porcentaje}%`;
}

// Muestro el contenido del carrito en forma de tabla con el detalle de precios
function mostrarCarrito() {
    let total = 0;
    let pasajeros = document.getElementById("pasajeros").value;
    let cuotas = document.getElementById("cuotas").value;
    let auxDiv = document.getElementById("grilla");

    let index = 0;
    for (let paquete of carrito) {    
        let auxDivDest = document.createElement("div");
        auxDivDest.className = "tableDestino";
        auxDivDest.innerText = paquete.nombre;
    
        let auxDivPU = document.createElement("div");
        auxDivPU.className = "tablePrecioUnitario";
        let auxPrecio = paquete.precio;
        auxDivPU.innerText = parseInt(auxPrecio);
    
        let auxDivPT = document.createElement("div");
        auxDivPT.className = "tablePrecioTotal";
        auxDivPT.id = "tablePrecioTotal" + index;
        let auxPrecioTotal = auxPrecio * pasajeros;
        auxDivPT.innerText = parseInt(auxPrecioTotal);

        let auxDivPF = document.createElement("div");
        auxDivPF.className = "tablePrecioFinal";
        auxDivPF.id = "tablePrecioFinal" + index;
        
        // Aplico descuento por pasajero adicional
        let auxPrecioFinal = aplicarDescuento(auxPrecio,pasajeros) * pasajeros;
        // Aplico comisiones por financiacion
        auxPrecioFinal = aplicarRecargo(auxPrecioFinal,cuotas);
        auxDivPF.innerText = parseInt(auxPrecioFinal);

        auxDiv.appendChild(auxDivDest);
        auxDiv.appendChild(auxDivPU);
        auxDiv.appendChild(auxDivPT);
        auxDiv.appendChild(auxDivPF);

        // Actualizo Total
        total += parseInt(auxPrecioFinal);

        // Itero entre los objetos del array
        index++;
    }
    // Asigno los Totales
    let auxDivDest = document.createElement("div");
    auxDivDest.className = "tableDestino";
    auxDivDest.innerText = "TOTAL";
    let auxDivPU = document.createElement("div"); 
    auxDivPU.className = "tablePrecioUnitario";
    auxDivPU.innerText = "-----";
    let auxDivPT = document.createElement("div"); 
    auxDivPT.className = "tablePrecioTotal";
    auxDivPT.innerText = "-----";
    let auxDivPF = document.createElement("div"); 
    auxDivPF.className = "tablePrecioFinal";
    auxDivPF.id = "tableTotal";
    auxDivPF.innerText = total;
    auxDiv.appendChild(auxDivDest);
    auxDiv.appendChild(auxDivPU);
    auxDiv.appendChild(auxDivPT);
    auxDiv.appendChild(auxDivPF);

    // Muestro los descuentos y recargos
    let porcentaje = obtenerFinanciacion(cuotas);
    let auxParrafo = document.getElementById("parrafo");
    auxParrafo.innerHTML = `(*1) Descuento del 5% por pasajero adicional (hasta un máximo de 4 pasajeros)<br>(*2) CFT - Costo Financiero Total en ${cuotas} cuota(s): ${porcentaje}%`;
}

// Espero a que se termine de cargar el DOM y asigno los eventos
$(function() {
    // Asigno eventos al textbox de Pasajeros
    $("#pasajeros").change(actualizarCarrito);
    $("#pasajeros").keyup(actualizarCarrito);
    // Asigno evento al combo de Cuotas
    $("#cuotas").change(actualizarCarrito);
    // Asocio el evento onClick al boton Volver
    $("#btnVolver").on('click',() => {location.href="index.html"});
});

// Muestro el Detalle del Carrito de Compras
mostrarCarrito();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Funcion para el vaciado del carrito
function vaciarCarrito() {
    carrito.splice(0, carrito.length);
    localStorage.removeItem("carrito");                
    localStorage.removeItem("pasajeros");
    localStorage.removeItem("cuotas");                
}

// Realizo una llamada Ajax POST para enviar los datos de pago al servidor
const URLGET = "https://jsonplaceholder.typicode.com/posts"
$("#btnPagar").click(() => {
    // Obtengo el monto a pagar y cantidad de cuotas
    let auxPrecioTotal = document.getElementById("tableTotal").innerText;
    let auxCuotas = document.getElementById("cuotas").value;
    // Declaro y asigno el JSON con la informacion de pago
    let infoPost = {};
    infoPost.montoFinal = auxPrecioTotal;
    infoPost.cuotas = auxCuotas;
    // Realizo la llamada POST y analizo el estado de la misma
    $.post(URLGET, infoPost ,(respuesta, estado) => {
        if(estado === "success") {
            let mensaje = `Se ha realizado el pago de $${respuesta.montoFinal} en ${respuesta.cuotas} cuota(s) de forma exitosa.`
            //$("body").prepend(`<div> ${mensaje} </div>`);   
            mostrarMensaje2(mensaje,"success");
        }
    });
});
