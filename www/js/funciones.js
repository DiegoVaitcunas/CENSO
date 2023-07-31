////////////////////////////GENERALIDADES/////////////////////////////////////////
const MENU = document.querySelector('#menu');
const ROUTER = document.querySelector('#ruteo');
const HOME = document.querySelector('#pantalla-home');
const LOGIN = document.querySelector('#pantalla-login');
const REGISTRO = document.querySelector('#pantalla-registro');
const REGISTRAR_CENSO = document.querySelector('#pantalla-registros');
/*const MAPA = document.querySelector('#menu');*/


function cerrarMenu(){
    MENU.close();
}

ROUTER.addEventListener('ionRouteDidChange', navegar);

function navegar(evt){
    console.log(evt.detail.to);
    const RUTA = evt.detail.to;
    ocultarPantallas();
    switch (RUTA) {
        case "/":
            HOME.style.display = 'block';
            break;
        case "/login":
            LOGIN.style.display = 'block';
            break;
        case "/registro":
            REGISTRO.style.display = 'block';
            break;
        case "/registrar-censo":
            REGISTRAR_CENSO.style.display = 'block';
            break;
        default:
            HOME.style.display = 'block';
            break;
    }
}

function ocultarPantallas(){
    HOME.style.display = 'none';
    LOGIN.style.display = 'none';
    REGISTRO.style.display = 'none';
    REGISTRAR_CENSO.style.display = 'none';
}

let personas = [];

let tokenUsuarioLogueado = '';

let baseURL = 'https://censo.develotion.com/'

inicializar();

function inicializar() {
    suscripcionAEventos()
    console.log('Comienza la app')
}

function suscripcionAEventos() {
    // Login.
    document.querySelector("#btnLoginIngresar").addEventListener("click", btnLoginIngresarHandler);
    // Registro.
    //document.querySelector("#btnRegistroRegistrarse").addEventListener("click", btnRegistroRegistrarseHandler);
    // Ruteo
    ROUTER.addEventListener("ionRouteDidChange", navegar);
    // Sucursales
    //COMBO_FILTRO_SUCURSALES.addEventListener("ionChange", comboSucursalesChangeHandler);
}




function actualizarMenu() {
    // Oculto todo, luego mostraré sólo lo que corresponde.
    document.querySelector("#btnMenuIngreso").style.display = "none";
    document.querySelector("#btnMenuRegistro").style.display = "none";
    document.querySelector("#btnMenuCerrarSesion").style.display = "none";
    if (tokenUsuarioLogueado) {
        document.querySelector("#btnMenuCerrarSesion").style.display = "block";  
    } else {
        //document.querySelector("#btnMenuIngreso").style.display = "block";
        //document.querySelector("#btnMenuRegistro").style.display = "block";
    }
}

///////////////////////////////////////////////////////////////////////////////////


//////////////////////////// LOGIN ////////////////////////////////////////////////

function btnLoginIngresarHandler () {
    const emailIngresado = document.querySelector("#txtLoginEmail").value;
    const passwordIngresado = document.querySelector("#txtLoginPassword").value;
    console.log("Comienzo a registrar un usuario");
    if (emailIngresado.trim().length > 0 && passwordIngresado.trim().length > 0) {
        let datos = {
            email: emailIngresado,
            password: passwordIngresado
        };
        
        fetch(baseURL + 'login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
            
        })
        .then(response => {
            console.log("LLego al then", response);
            return response.json();
        })
        .then(data => {
            if (data.error) {
                mostrarToast('ERROR', 'Error', data.error);
            }
        })
        .catch(error => console.log(error));
    } else {
        mostrarToast('ERROR', 'Datos incompletos', 'Debe ingresar email y contraseña');
    }
    console.log("Llego hasta aca, final de la funcion");
}

async function mostrarToast(tipo, titulo, mensaje) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = mensaje;
    toast.position = 'bottom';
    toast.duration = 2000;
    if (tipo === "ERROR") {
        toast.color = "danger";
    } else if (tipo === "SUCCESS") {
        toast.color = "success";
    } else if (tipo === "WARNING") {
        toast.color = "warning";
    }

    document.body.appendChild(toast);
    return toast.present();
}


///////////////////////////////////////////////////////////////////////////////////


//////////////////////////// REGISTRO /////////////////////////////////////////////
function vaciarCamposRegistro() {
    document.querySelector("#txtRegistroNombre").value = '';
    document.querySelector("#txtRegistroApellido").value = '';
    document.querySelector("#txtRegistroEmail").value = '';
    document.querySelector("#txtRegistroDireccion").value = '';
    document.querySelector("#txtRegistroPassword").value = '';
    document.querySelector("#txtRegistroVerificacionPassword").value = '';
}

//////////////////////////////////////////////////////////////////////////////////


////////////////////////// REGISTRO CENSO ///////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////


/////////////////////////// LISTAR CENSO /////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////

