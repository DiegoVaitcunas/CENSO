////////////////////////////GENERALIDADES/////////////////////////////////////////
const MENU = document.querySelector('#menu');
const ROUTER = document.querySelector('#ruteo');
const HOME = document.querySelector('#pantalla-home');
const LOGIN = document.querySelector('#pantalla-login');
const REGISTRO = document.querySelector('#pantalla-registro');
const REGISTRAR_CENSO = document.querySelector('#pantalla-registros');
const NAV = document.querySelector("#nav");
const AGREGARPERSONA = document.querySelector("#pantalla-AgregarPersona");
const COMBO_DEPARTAMENTOS = document.querySelector("#pantallaAgregarPersona-Combo-Departamentos");
const COMBO_CIUDADES = document.querySelector("#pantallaAgregarPersona-Combo-Ciudad");
const COMBO_OCUPACIONES = document.querySelector("#pantallaAgregarPersona-Combo-Ocupaciones");
const COMBO_FECHA = document.querySelector("#dateFechaNacimientoAp");
const MAPA = document.querySelector("#pantalla-combo-mapa");
const PANTALLA_MAPA = document.querySelector("#pantalla-mapa");

/*const MAPA = document.querySelector('#menu');*/

let personas = [];
let departamentos = [];
let ciudades = [];
let todasLasCiudades = [];
let ocupaciones = [];
let tokenUsuarioLogueado = '';
let idUsuario = '';
let baseURL = 'https://censo.develotion.com/';
let edadUsuario = '';
let mapita = null;
let posicionUsuario = [-34.903842, -56.1906122];
let marcadoresCensados = [];

inicializar();

function inicializar() {
    actualizarMenu()
    mostrarLogin()
    suscripcionAEventos()
    //cargarPosicionUsuario();
}

function cerrarMenu(){
    MENU.close();
}

function verificarInicio() {
  if (tokenUsuarioLogueado) {
      NAV.setRoot("page-home");
      NAV.popToRoot();
  } else {
      NAV.setRoot("page-login");
      NAV.popToRoot();
  }
}

/*function cargarPosicionUsuario() {
  if (Capacitor.isNativePlatform()) {
      const loadCurrentPosition = async function () {
          const resultado = await Capacitor.Plugins.Geolocation.getCurrentPosition({timeout: 3000});

          if (resultado.coords.latitude) {
              posicionUsuario = [resultado.coords.latitude, resultado.coords.longitude];
          } else {
              posicionUsuario = [-34.903842, -56.1906122];
          }
      };
      loadCurrentPosition();
  } else {
      window.navigator.geolocation.getCurrentPosition(
          // Callback de éxito.
          function (pos) {
              console.log(pos);
              posicionUsuario = [pos.coords.latitude, pos.coords.longitude];
          },
          // Callback de error.
          function () {
              posicionUsuario = [-34.903842, -56.1906122];
          }
      );
  }
}*/

function navegar(evt){
    console.log(evt.detail.to);
    const RUTA = evt.detail.to;
    ocultarPantallas();
    switch (RUTA) {
        case "/":
            verificarInicio()
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
        case "/personas":
            AGREGARPERSONA.style.display = 'block';
            break;
        case "/mapa":
            PANTALLA_MAPA.style.display = 'block';
            obtenerTodasLasCiudades();
            inicializarMapa();
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
    AGREGARPERSONA.style.display = 'none';
    MAPA.style.display = 'none';
    PANTALLA_MAPA.style.display = 'none';

}

function mostrarLogin() {
  console.log("ingreso aca y muestro el login al usuario")
    ocultarPantallas();
    LOGIN.style.display = "block";
}


function agregarPersona() {
    ocultarPantallas();
    AGREGARPERSONA.style.display = "block";
}
function suscripcionAEventos() {
    // Login.
    document.querySelector("#btnLoginIngresar").addEventListener("click", btnLoginIngresarHandler);
    // Registro.
    document.querySelector("#btnRegistroRegistrarse").addEventListener("click", btnRegistroRegistrarseHandler);
    // Ruteo
    //AUTOLOGIN
    document.addEventListener('DOMContentLoaded', autoLogin);
    //COMBO CIUDAD POR DEPARTAMENTO
    COMBO_DEPARTAMENTOS.addEventListener('ionChange', obtenerCiudadesChangeHandler);
    COMBO_FECHA.addEventListener('ionChange', actualizarComboOcupaciones);
    //NAVEGADOR
    ROUTER.addEventListener("ionRouteDidChange", navegar);
    document.querySelector("#btnAgregarPersonaAp").addEventListener("click", btnAgregarPersona);
    //AGREGAR PERSONA
    //COMBO_FILTRO_SUCURSALES.addEventListener("ionChange", comboSucursalesChangeHandler);
    //BOTON BUSCAR EN EL MAPA
    document.querySelector("#btn-buscar").addEventListener("click", buscarCensadosEnMapa);
}

function actualizarMenu() {
    document.querySelector("#btnMenuHome").style.display = "none";
    document.querySelector("#btnMenuIngreso").style.display = "none";
    document.querySelector("#btnMenuRegistro").style.display = "none";
    document.querySelector("#btnMenuRegistrarCenso").style.display = "none";
    document.querySelector("#btnMenuCerrarSesion").style.display = "none";
    document.querySelector("#btnAgregarUnaPersona").style.display = "none"; 
    document.querySelector("#btnVerMapa").style.display = "none"; 
    if (tokenUsuarioLogueado) {
        console.log(tokenUsuarioLogueado);
        document.querySelector("#btnMenuHome").style.display = "block";
        document.querySelector("#btnMenuRegistrarCenso").style.display = "block";
        document.querySelector("#btnMenuCerrarSesion").style.display = "block"; 
        document.querySelector("#btnAgregarUnaPersona").style.display = "block";
        document.querySelector("#btnVerMapa").style.display = "block";

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
                idUsuario = data.id             
                localStorage.setItem('APPProductosToken', tokenUsuarioLogueado);
                functionObtenerDepartamentosAPI(tokenUsuarioLogueado, idUsuario);
                obtenerOcupacionesApi(tokenUsuarioLogueado, idUsuario);
                actualizarMenu();
                NAV.setRoot("page-home");
                // Llamar a functionObtenerDepartamentosAPI y pasar el token
                
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

function vaciarCamposAgregarPersona() {
  document.querySelector("#txtNombreAp").value = '';
  document.querySelector("#pantallaAgregarPersona-Combo-Departamentos").value = '';
  document.querySelector("#pantallaAgregarPersona-Combo-Ciudad").value = '';
  document.querySelector("#dateFechaNacimientoAp").value = '';
  document.querySelector("#pantallaAgregarPersona-Combo-Ocupaciones").value = '';
}


function autoLogin() {
    // Comprobar si hay datos de inicio de sesión almacenados en localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    const passwordGuardado = localStorage.getItem('password');
    if (usuarioGuardado && passwordGuardado) {
        // Realizar el auto-login utilizando los datos almacenados
        let datos = {
            usuario: usuarioGuardado,
            password: passwordGuardado
        };
        fetch(baseURL + 'login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => {
            if (response.status === 200) {
                mostrarLogin()
                // Iniciar sesión exitosa, realizar las acciones necesarias
                console.log("Llego al auto-login")
            } else {
                // Los datos almacenados ya no son válidos, borrarlos del localStorage
                localStorage.removeItem('usuario');
                localStorage.removeItem('password');
            }
        })
        .catch(error => console.log(error));
    }
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
                    // Guardar datos de inicio de sesión en localStorage
                localStorage.setItem('usuario', usuario);
                localStorage.setItem('password', passwordIngresado);
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
function btnAgregarPersona() {
    const nombre = document.querySelector("#txtNombreAp").value;
    const departamento = document.querySelector("#pantallaAgregarPersona-Combo-Departamentos").value;
    const ciudad = document.querySelector("#pantallaAgregarPersona-Combo-Ciudad").value;
    const fechaNacimiento = document.querySelector("#dateFechaNacimientoAp").value;
    const ocupacion = document.querySelector("#pantallaAgregarPersona-Combo-Ocupaciones").value;
    console.log("Llega a la funcion agregar persona")
    const datos = {
      idUsuario: idUsuario,
      nombre: nombre,
      departamento: departamento,
      ciudad: ciudad,
      fechaNacimiento: fechaNacimiento,
      ocupacion: ocupacion
    };
    console.log(datos);
    fetch(baseURL + 'personas.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': tokenUsuarioLogueado,
        'iduser': idUsuario
      },
      body: JSON.stringify(datos)
    })
    .then(response => {
      if (response.status === 200) {
        console.log(response.status, "estoy agregando una persona quiero saber el status que me devuelve la api")
        return response.json();
      } else {
        throw new Error('Error al agregar persona');
      }
    })
    .then(data => {
        console.log(data);
        mostrarToast('SUCCESS', 'Persona agregada', data.mensaje);
        console.log('ID del censo:', data.idCenso);
        vaciarCamposAgregarPersona()
    })
    .catch(error => {
      console.error(error);
      mostrarToast('ERROR', 'Error', 'Hubo un problema al agregar la persona.');
    });
  }
  

/////////////////////////////////////////////////////////////////////////////////


/////////////////////////// LISTAR CENSO /////////////////////////////////////////
function listarCenso(){
    console.log("Llegamos a la pagina listar censo")
}

//////////////////////////////////////////////////////////////////////////////////

///////////////////////////////COMBOS DESPLEGABLES////////////////////////////////
function functionObtenerDepartamentosAPI(token, idUsuario) {
    departamentos = [];
  
    fetch(baseURL + 'departamentos.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': token,
        'iduser': idUsuario
      }
    })
    .then(response => {
      if (response.status === 401) {
        cerrarSesionPorFaltaDeToken()
      } else {
        return response.json();
      }
    })
    .then(data => {
      if (data) {
        departamentos = data;
        console.log(departamentos);
        actualizarComboDepartamentos();
      } else {
        mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
      }
    })
    .catch(error => console.log(error,));
  }

  function actualizarComboDepartamentos() {
    console.log("LLega a la funcion actualizar combo departamentos")
        COMBO_DEPARTAMENTOS.innerHTML = '';
        for (let index = 0; index < departamentos.departamentos.length; index++) {
            const Item = departamentos.departamentos[index];
            COMBO_DEPARTAMENTOS.innerHTML += `<ion-select-option value="${Item.id}">${Item.nombre}</ion-select-option>`;
        }
}


function obtenerCiudadesChangeHandler(evt) {
    const idDepartamento = evt.detail.value;
    console.log("ID del departamento seleccionado:", idDepartamento);
    console.log("Token del usuario logueado:", tokenUsuarioLogueado);
    console.log("ID del usuario:", idUsuario);
    fetch(`${baseURL}ciudades.php?idDepartamento=${idDepartamento}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': tokenUsuarioLogueado,
        'iduser': idUsuario
      }
    })
    .then(response => {
      if (response.status === 401) {
        cerrarSesionPorFaltaDeToken()
      } else {
        return response.json();
      }
    })
    .then(data => {
      if (data) {
        console.log("Ciudades del departamento:", data);
        ciudades = data;
        actualizarComboCiudades(ciudades)
        
      } else {
        mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
      }
    })
    .catch(error => console.log(error));
  }

function actualizarComboCiudades(ciudades) {
    console.log("LLega a la funcion actualizar combo ciudades")
        console.log(ciudades);
        const CiudadesDos = ciudades;
        console.log(CiudadesDos);
        COMBO_CIUDADES.innerHTML = '';
        for (let index = 0; index < CiudadesDos.ciudades.length; index++) {
            const Item = CiudadesDos.ciudades[index];
            console.log(Item);
            COMBO_CIUDADES.innerHTML += `<ion-select-option value="${Item.id}">${Item.nombre}</ion-select-option>`;
        }
}

/////////////////////////////////////////COMBO OCUPACION/////////////////////////////////////////
function obtenerOcupacionesApi(tokenUsuarioLogueado, idUsuario) {
    console.log("Token del usuario logueado:", tokenUsuarioLogueado);
    console.log("ID del usuario:", idUsuario);
  
    fetch(`${baseURL}ocupaciones.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': tokenUsuarioLogueado,
        'iduser': idUsuario
      }
    })
    .then(response => {
      if (response.status === 401) {
        cerrarSesionPorFaltaDeToken()
      } else {
        return response.json();
      }
    })
    .then(data => {
      if (data) {
        ocupaciones=data;
      } else {
        mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
      }
    })
    .catch(error => console.log(error));
}
  
function actualizarComboOcupaciones() {
        edadUsuario='';
        edadUsuario=COMBO_FECHA.value;
        console.log(edadUsuario);
        edadUsuario=calcularEdad(edadUsuario);
        console.log(edadUsuario);
        COMBO_OCUPACIONES.innerHTML = '';
        for (let index = 0; index < ocupaciones.ocupaciones.length; index++) {
          const Item = ocupaciones.ocupaciones[index];
          if(edadUsuario>18){
            COMBO_OCUPACIONES.innerHTML += `<ion-select-option value="${Item.id}">${Item.ocupacion}</ion-select-option>`;
          }else{
            COMBO_OCUPACIONES.innerHTML = `<ion-select-option value="${Item.id}">ESTUDIANTE</ion-select-option>`;
          }
          console.log(Item);
        }
}


function calcularEdad(fechaNacimiento) {
  const fechaNac = new Date(fechaNacimiento);
  const fechaActual = new Date();
  let edad = fechaActual.getFullYear() - fechaNac.getFullYear();
  const mesActual = fechaActual.getMonth();
  const diaActual = fechaActual.getDate();
  const mesNac = fechaNac.getMonth();
  const diaNac = fechaNac.getDate();
  if (mesActual < mesNac || (mesActual === mesNac && diaActual < diaNac)) {
    edad--;
  }
  return edad;
}

//////////////////////////////////////////////////////MAPA/////////////////////////////////
function inicializarMapa() {
  if(!mapita) {
      mapita = L.map('mapa-censados').setView(posicionUsuario, 16);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
      }).addTo(mapita);

      L.marker(posicionUsuario).addTo(mapita).bindPopup("Acá está el usuario.");
  }
}
//////////////////////////////////////OBTENER CIUDADES EN EL MAPA//////////////////////////////////////////////////////
function obtenerTodasLasCiudades(){
  console.log(tokenUsuarioLogueado);
  console.log(idUsuario);
  fetch(baseURL + '/ciudades.php', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'apikey': tokenUsuarioLogueado,
          'iduser': idUsuario

      }
  })
  .then(response => {
      if (response.status === 401) {
          console.log(response.status);
      } else {
          return response.json();
      }
  })
  .then(data => {
      if (data) {
          todasLasCiudades = data.ciudades;        
          console.log(todasLasCiudades)
      } else {
        mostrarToast('ERROR', 'Error', 'Por favor, intente nuevamente.');
      }
    })
    .catch(error => console.log(error,));
}

//////////////////////////////////////////////////FUNCION MAPA///////////////////////////////////////////////////


// Función para calcular la distancia en kilómetros entre dos coordenadas geográficas.
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;
  return distancia;
}

function buscarCensadosEnMapa() {
  const radioKm = document.querySelector("#radio-busqueda").value;
  marcadoresCensados = []; // Creamos un array para almacenar los marcadores de las personas censadas.

  // Recorremos todas las personas censadas.
  personas.forEach(persona => {
    // Buscamos la ciudad de la persona en todasLasCiudades.
    const ciudad = todasLasCiudades.find(ciudad => ciudad.id === persona.ciudad);

    if (ciudad) {
      // Calculamos la distancia entre la posición del censista y la ubicación de la persona.
      const distancia = calcularDistancia(latCensista, lonCensista, ciudad.latitud, ciudad.longitud);

      if (distancia <= radioKm) {
        // Si la distancia es menor o igual al radio especificado, mostramos el marcador en el mapa.
        const marcador = L.marker([ciudad.latitud, ciudad.longitud]).addTo(mapita).bindPopup(`Ciudad: ${ciudad.nombre}`);
        marcadoresCensados.push(marcador);
      }
    }
  });
}


  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////