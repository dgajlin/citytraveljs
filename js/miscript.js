// Recupero los datos del carrito guardados en el Local Storage
let carrito = JSON.parse(localStorage.getItem("carrito"));
if (!Array.isArray(carrito))
  carrito = [];

// Actualizo la cantidad de Items en el carrito
let items = carrito.length;
document.getElementById("cantDestinos").innerText = items;

// Funcion para mostrar mensajes en pantalla utilizando SweetAlert
// Parametros de Entrada
// mensaje: Contiene el mensaje a mostrar en pantalla
// icono: Icono a mostrar en el mensaje, puede ser success o warning
function mostrarMensaje(mensaje, icono) {
    Swal.fire({html: mensaje,
               icon: icono,
               width:'30rem',
               confirmButtonText: `Aceptar`,
               timer:'2500'
    });
}

// Funcion de confirmacion de agregado de un destino al carrito
// Parametro de Entrada
// idDestino: Indice del array de Paquetes turisticos
function confirmarDestino(idDestino) {
    Swal.fire({  
        text: 'Desea agregar el Destino al carrito?',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        cancelButtonText: `Cancelar`,
        confirmButtonText: `Aceptar`,
    }).then(result => {
        if (result.value) {
            agregarDestino(idDestino)
        }
    })
};

// Creo la clase Destino con sus Metodos y Atributos
class Destino {
    constructor(id,imagen,nombre,horas,precio,almuerzo,disponible) {
        this.id = id;
        this.imagen = imagen;
        this.nombre = nombre;
        this.horas = parseInt(horas);
        this.precio = parseFloat(precio);
        this.almuerzo = almuerzo;
        this.disponible = disponible;
    }

    activarDestino() {
        // Function utilizada para disponibilizar la comercializacion del destino
        this.disponible = true;
    }

    desactivarDestino() {
        // Function utilizada para cancelar la comercializacion del destino
        this.disponible = false;
    }
}

// Instancio los destinos
const paquetes = [];
paquetes.push(new Destino(0,"ptomadero","Puerto Madero","8",7250,true,true));
paquetes.push(new Destino(1,"tigre","Tigre","8",6800,true,true));
paquetes.push(new Destino(2,"congreso","Congreso Nacional","6",2400,false,true));
paquetes.push(new Destino(3,"caminito","Caminito","4",4800,false,true));
paquetes.push(new Destino(4,"pzamayo","Centro y Plaza de Mayo","6",2900,false,true));
paquetes.push(new Destino(5,"reserva","Reserva Ecologica","4",1500,false,true));

// Actualizo el carrito agregandole el destino seleccionado
// Parametro de Entrada
// idDestino: Indice del array de Paquetes turisticos
function agregarDestino(idDestino) {
    // Oculto el carrito
    document.getElementById("carrito").style.height = "0px";

    // Verifico si el destino ya se encuentra en el carrito
    destinoAgregado = carrito.some(paquete => paquete.id == idDestino);
    if (destinoAgregado) {
        // Muestro confirmacion
        mostrarMensaje("El destino ya se encuentra en el carrito","warning");
    }
    else {
        // Actualizo la cantidad de Items en el carrito
        let cantPaquetes = parseInt(document.getElementById("cantDestinos").innerText);
        cantPaquetes++;
        document.getElementById("cantDestinos").innerText = cantPaquetes;

        // Agrego el destino al carrito
        carrito.push(paquetes[idDestino]);
    
        // Persisto el carrito en el Local Storage
        localStorage.setItem("carrito",JSON.stringify(carrito));

        // Muestro confirmacion
        mostrarMensaje("El destino ha sido agregado al carrito","success");
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Instancio el Array de Promociones
const Promociones = [];
let promocion;
promocion = 'Promoción!!: Reservando una excursión al "Delta del Tigre" antes del 30/11/21 obtenés un kit de viaje.';
Promociones.push(promocion);
promocion = 'Promoción!!: Reservando una excursión a "Caminito" antes del 30/11/21 obtenés un kit de viaje.';
Promociones.push(promocion);
promocion = 'Promoción!!: Reservando una excursión a "Puerto Madero" antes del 30/11/21 obtenés un kit de viaje.';
Promociones.push(promocion);

// Muestro promocion de forma aleatoria
auxID = parseInt(Math.random() * 3);
$("#oferta").text(Promociones[auxID]);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Muestro el carrito en el lado superior/derecho de la pantalla
function mostrarCarrito() {
    let contCarrito =  document.getElementById("carrito");
    if (contCarrito.style.height == "200px") {
        // Oculto el carrito de Compras
        $("#micarrito").slideUp(1500, function() {
            contCarrito.style.height = "0px";
        });
    }
    else {
        // Armo el mensaje a mostrar
        let cuadro1 = "";
        let cuadro2 = "";
        let montoTotal = 0;

        // Recorro el listado de destinos agregados al carrito
        if (carrito.length > 0) {
           for (let destino of carrito) {
                cuadro1 += destino.nombre + "<br>";
                cuadro2 += "$" + destino.precio + "<br>";
                montoTotal += destino.precio;           
            }

            // Calculo el total del carrito
            cuadro1 += "<br>Total (sin descuentos)<br><br>";
            cuadro2 += "<br> $" + montoTotal;

            // Actualizo la informacion en la pagina
            document.getElementById("dest").innerHTML = cuadro1;
            document.getElementById("precio").innerHTML = cuadro2;
        }
        else {
            // Muestro mensaje de carrito vacio
            document.getElementById("dest").innerHTML = "El carrito está vacío.<br><br><br><br>";
            document.getElementById("precio").innerHTML = "";
        }

        // Muestro el carrito de Compras
        contCarrito.style.height = "200px";

        // Aplico animacion a la visualizacion del carrito
        $("#micarrito").slideUp(0, function() {
            $("#micarrito").slideDown(1500);
        });
    }

    // Me posiciono al tope de la pagina para mostrar el carrito
    window.scrollTo(0,0);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Genero Array de Destinos a mostrar en el Carrousel
const arrDestinos = [["tigre","Tigre"],["teatrocolon","Teatro Colon"],["caminito","Caminito"],["planetario","Planetario"],["ptomadero","Puerto Madero"],["pzamayo","Plaza de Mayo"]];

// Armo Carrousel desde el Array de Destinos
arrDestinos.forEach((destino, index) => {
    let auxId = "img" + (index + 1);
    let auxImg = `<img class="${destino[0]}" alt="${destino[1]}" />`;
    $("#" + auxId).append(auxImg);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Asigno el detalle de cada Destino de manera programatica desde el Array de Objetos (Destinos)
let index = 0;
for (let destino of paquetes) {
    // Verifico si el destino esta disponible
    if (destino.disponible) {
        let auxId = "dest" + index;
        let auxDiv = document.getElementById(auxId);

        // Asigno el Header con el Nombre del Destino
        let auxNom = document.createElement("h3");
        auxNom.className = "nombreDestino";
        auxNom.innerText = destino.nombre;
    
        // Asigno la Imagen del Destino
        let auxDivFoto = document.createElement("div");
        let auxImg = document.createElement("img");
        auxDivFoto.className = "fotoDestino";
        auxImg.alt = destino.nombre;
        auxImg.className = destino.imagen + " imagenDestino";
        auxDivFoto.appendChild(auxImg);

        // Asigno la Descripcion del Destino
        let auxDivDesc = document.createElement("div");
        let auxDesc = document.createElement("p");
        auxDivDesc.className = "DescDestino";
        auxDesc.className = "descDestino";
        auxDesc.innerText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.";
        auxDivDesc.appendChild(auxDesc);
    
        // Asigno el Boton
        let auxDivBoton = document.createElement("div");
        let auxBoton = document.createElement("button");
        auxDivBoton.className = "botonDestino";
        auxBoton.className="btnAgregar";
        auxBoton.id = "btnDest" + index;
        auxBoton.innerText ="Agregar al Carrito";
        auxDivBoton.appendChild(auxBoton);

        // Agrego los elementos a la pagina
        auxDiv.appendChild(auxNom);
        auxDiv.appendChild(auxDivFoto);   
        auxDiv.appendChild(auxDivDesc);   
        auxDiv.appendChild(auxDivBoton);
    }
 
     // Itero entre los objetos del array
    index++;
}

// Funcion para el vaciado del carrito
function vaciarCarrito() {
    if (parseInt(document.getElementById("cantDestinos").innerText) > 0) {
        Swal.fire({  
            text: 'Realmente desea vaciar el carrito?',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',    
            cancelButtonText: `Cancelar`,
            confirmButtonText: `Aceptar`,
        }).then(result => {
        if (result.value) {
                // Si confirmo se realiza el vaciado del carrito
                carrito.splice(0, carrito.length);
                document.getElementById("cantDestinos").innerText = 0;
                document.getElementById("carrito").style.height = "0px";
                localStorage.removeItem("carrito");                
                localStorage.removeItem("pasajeros");
                localStorage.removeItem("cuotas");                
            }
        })
    } 
    else {
        document.getElementById("carrito").style.height = "0px";   
    }
}

// Muestro el detalle del costo de lo cargado en el carrito
function pagarCarrito() {
    if (carrito.length > 0)
        location.href="carrito.html"
    else {
        mostrarMensaje("El carrito de compras está vacío","warning");
        // Oculto el carrito de Compras
        let contCarrito =  document.getElementById("carrito");
        contCarrito.style.height = "0px";
    }
}

// Espero a que se termine de cargar el DOM y asigno los eventos
$(function() {
    // Asigno el evento OnClick a cada boton de cada destino
    for (let cont=0; cont < 6; cont++) {
        if (paquetes[cont].disponible) {
            $("#btnDest" + cont).on('click',() => confirmarDestino(cont));
        }
    }
    // Asigno el evento OnClick al boton del carrito de compras
    $("#btnCarrito").on('click',() => mostrarCarrito());
    //Asigno los eventos a los botones Pagar y Vaciar Carrito
    $("#btnPagar").on('click',() => pagarCarrito());
    $("#btnVaciar").on('click',() => vaciarCarrito());

    // Aplico una animacion al Logo de la pagina
    $("#logo").animate({color: 'white'},6000);
    $("#logo").animate({color: 'yellow'},500);
    $("#logo").animate({color: 'white'},1000);
});
