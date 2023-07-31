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