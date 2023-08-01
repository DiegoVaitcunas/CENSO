////////////////////////////GENERALIDADES/////////////////////////////////////////
const MENU = document.querySelector('#menu');
const ROUTER = document.querySelector('#ruteo');
const HOME = document.querySelector('#pantalla-home');
const LOGIN = document.querySelector('#pantalla-login');
const REGISTRO = document.querySelector('#pantalla-registro');
const REGISTRAR_CENSO = document.querySelector('#pantalla-registros');
const NAV = document.querySelector("#nav");
/*const MAPA = document.querySelector('#menu');*/

let personas = [];
let tokenUsuarioLogueado = '';
let baseURL = 'https://censo.develotion.com/'

inicializar();

function inicializar() {
    actualizarMenu()
    suscripcionAEventos()
    mostrarLogin()
}

function cerrarMenu(){
    MENU.close();
}

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

function mostrarLogin() {
    ocultarPantallas();
    LOGIN.style.display = "block";
}





function suscripcionAEventos() {
    // Login.
    document.querySelector("#btnLoginIngresar").addEventListener("click", btnLoginIngresarHandler);
    // Registro.
    document.querySelector("#btnRegistroRegistrarse").addEventListener("click", btnRegistroRegistrarseHandler);
    // Ruteo
    ROUTER.addEventListener("ionRouteDidChange", navegar);
    // Sucursales
    //COMBO_FILTRO_SUCURSALES.addEventListener("ionChange", comboSucursalesChangeHandler);
}

function actualizarMenu() {
    document.querySelector("#btnMenuHome").style.display = "none";
    document.querySelector("#btnMenuIngreso").style.display = "none";
    document.querySelector("#btnMenuRegistro").style.display = "none";
    document.querySelector("#btnMenuRegistrarCenso").style.display = "none";
    document.querySelector("#btnMenuCerrarSesion").style.display = "none";
    if (tokenUsuarioLogueado) {
        document.querySelector("#btnMenuHome").style.display = "block";
        document.querySelector("#btnMenuRegistrarCenso").style.display = "block";
        document.querySelector("#btnMenuCerrarSesion").style.display = "block";  
    } else {
        document.querySelector("#btnMenuIngreso").style.display = "block";
        document.querySelector("#btnMenuRegistro").style.display = "block";
    }
}

function cerrarSesionPorFaltaDeToken() {
    mostrarToast('ERROR', 'No autorizado', 'Se ha cerrado sesión por seguridad');
    cerrarSesion();
}

function cerrarSesion () {
    cerrarMenu();
    localStorage.clear();
    tokenUsuarioLogueado = '';
    actualizarMenu();
    NAV.setRoot("page-login");
    NAV.popToRoot();
}

///////////////////////////////////////////////////////////////////////////////////

//////////////////////////// LOGIN ////////////////////////////////////////////////

function btnLoginIngresarHandler () {
    const emailIngresado = document.querySelector("#txtLoginEmail").value;
    const passwordIngresado = document.querySelector("#txtLoginPassword").value;

    console.log("Comienzo a registrar un usuario");
    if (emailIngresado.trim().length > 0 && passwordIngresado.trim().length > 0) {
        let datos = {
            usuario: emailIngresado,
            password: passwordIngresado
        };
        
        fetch('https://censo.develotion.com/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => {
            console.log("Llego al then", response);
            if (response.status === 200) {
                vaciarCamposLogin();
                mostrarToast('SUCCESS', 'Login exitoso', 'Ya esta en el sistema');
            }
            return response.json();
        })
        .then(data => {
            if (data.mensaje) {
                mostrarToast('ERROR', 'Error', data.mensaje);
            }else{
                tokenUsuarioLogueado = data.apiKey;
                localStorage.setItem('APPProductosToken', tokenUsuarioLogueado);
                actualizarMenu();
                NAV.setRoot("page-home");
            }
        })
        .catch(error => console.log(error));
    } else {
        mostrarToast('ERROR', 'Datos incompletos', 'Debe ingresar email y contraseña');
    }
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

function vaciarCamposLogin() {
    document.querySelector("#txtLoginEmail").value = '';
    document.querySelector("#txtLoginPassword").value = '';
    //document.querySelector("#txtVerificarPassword").value = '';
}


///////////////////////////////////////////////////////////////////////////////////


//////////////////////////// REGISTRO /////////////////////////////////////////////

function btnRegistroRegistrarseHandler () {
    const usuario = document.querySelector("#txtRegistroUsuario").value;
    const passwordIngresado = document.querySelector("#txtRegistroPassword").value;
    //verificar ppass
    // Verifico que el usuario haya escrito algo en todos los campos.
    if (
        usuario.trim().length > 0 &&
        passwordIngresado.trim().length > 0

        
    ) {
        let datos = {
            usuario: usuario,
            password: passwordIngresado
        };
            fetch(baseURL + 'usuarios.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            })
            .then(response => {
                if (response.status === 200) {
                    vaciarCamposRegistro();
                    mostrarToast('SUCCESS', 'Registro exitoso', 'Ya puede iniciar sesión');
                    listarCenso();
                }
                return response.json();
            })
            .then(data => {
                if (data.mensaje) {
                    mostrarToast('ERROR', 'Error', data.mensaje);
                }
            })
            .catch(error => console.log(error));

        } else {
            mostrarToast('ERROR', 'Datos incompletos', 'Todos los campos son obligatorios');
    }
}

    function vaciarCamposRegistro() {
    document.querySelector("#txtRegistroUsuario").value = '';
    document.querySelector("#txtRegistroPassword").value = '';
    //document.querySelector("#txtVerificarPassword").value = '';
}






//////////////////////////////////////////////////////////////////////////////////


////////////////////////// REGISTRO CENSO ///////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////


/////////////////////////// LISTAR CENSO /////////////////////////////////////////
function listarCenso(){
    console.log("Llegamos a la pagina listar censo")
}

//////////////////////////////////////////////////////////////////////////////////