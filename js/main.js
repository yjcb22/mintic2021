//Contantes
const URL_FINCA = "https://g2c470a075741f7-dbfinca.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/farm/farm";
const URL_CLIENTE = "https://g3187302123f80d-bdreto2021.adb.us-sanjose-1.oraclecloudapps.com/ords/admin/client/client";
const URL_MENSAJE = ""
//Variables
let tablaFinca = $("#tablaFinca");
let tablaFincaEditar = $("#tablaFincaEditar");
let tablaFincaCrear = $("#tablaFincaCrear");

let tablaCliente = $("#tablaCliente");
let tablaClienteEditar = $("#tablaClienteEditar");
let tablaClienteCrear = $("#tablaClienteCrear");

///////////LOGICA PROGRAMACION PARA CLIENTE///////////////////
//Comentario agregado para rama develop


//Se va a crear clientes por Pilar G

/*
Metodo: obtenerClientePorId
Realiza una peticion HTTP/GET para obtener un solo registro
de la base de datos por medio del API REST usando el ID.
*/
function obtenerClientePorId(element) {
    limpiarTabla("#tablaClienteEditar tr");
    let id = $(element).parent().parent().find('td').html();
    let urlId = URL_CLIENTE + "/" + id;

    $.ajax({
        url: urlId,
        dataType: "json",
        type: "GET",
        success: function (respuestaCliente) {
            agregarATablaEditarCliente(tablaClienteEditar, respuestaCliente);
        },
        error: function (xhr, status) {
            $("#mensajes").html("Error POST" + status);
        }
    });
}

/*
Metodo: listarCliente
Hacer una peticion HTTP/GET para obtener la lista de CLIENTES en la tabla
por medio del API REST configurada en Oracle cloud.
*/
function obtenerTodosLosClientes() {
    limpiarTabla("#tablaCliente tr");
    //console.log("hola");
    $.ajax({
        url: URL_CLIENTE,
        dataType: "json",
        type: "GET",
        success: function (respuestaCliente) {
            //console.log(respuestaCliente.items);
            console.log("Hola");
            agregarATablaCliente(tablaCliente, respuestaCliente);
        },
        error: function (xhr, status) {
            $("#mensajes").html("Error POST" + status);
        }
    });
}

/*
Metodo: agregarATablaCliente
Recibe la tabla y los elementos de la peticion HTTP 
para agregarlos a la tabla que lista las fincas creadas
*/
function agregarATablaCliente(tabla, data) {

    for (let i = 0; i < data["items"].length; i++) {
        const element = data["items"][i];
        //console.log("HOLA CLIENTE AGREGAR");
        //console.log(eleme );
        $(tabla).children().append("<tr><td>" + element["id"] + "</td><td><a onclick='obtenerClientePorId(this)' href='#'>" +
            element["name"] + "</a></td><td>" +
            element["email"] + "</td><td>" +
            element["age"] + "</td>" +
            "<td><button onclick='borrarCliente(this)'>Borrar</button></td></tr>");
        //console.log(i);

    }
}

/*
Metodo: agregarATablaEditarCliente
Recibe la tabla y los elementos de la peticion HTTP 
para agregarlos a la tabla que permite editar la informacion
*/
function agregarATablaEditarCliente(tabla, data) {
    for (let i = 0; i < data["items"].length; i++) {
        const element = data["items"][i];
        //console.log(element );
        //console.log("debe entrr A ACTUALIZAR CLIENTE");
        $(tabla).children().append("<tr><td>" +
            element["id"] + "</td><td><input name='test' id='test' value=\"" +
            element["name"] + "\"></td><td><input name='test' id='test' value=\"" +
            element["email"] + "\"></td><td><input name='test' id='test' value=\"" +
            element["age"] + "\"></td><td><button onclick='actualizarCliente(this)'>Actualizar</button></td></tr>");

    }
}

/*
Metodo: borrarCliente
Obtiene el ID del Cliente y envia una peticion HTTP para borrar
el elemento de la base de datos
*/
function borrarCliente(element) {
    let id = $(element).parent().parent().find('td').html();
    let datosObject = { id: id };

    $.ajax({
        url: URL_CLIENTE,
        data: JSON.stringify(datosObject),
        type: "DELETE",
        contentType: "application/JSON",
        success: function (respuestaCliente) {
            $("#mensajes").html("El CLIENTE con id: " + id + " fue borrado exitosamente");
        },
        error: function (xhr, status) {
            $("#mensajes").html("Error POST" + status);
        }
    });

    limpiarTabla("#tablaCliente tr");

    setTimeout(
        function () {
            obtenerTodosLosClientes();
        }, 200);
}

/*
Metodo: limpiarTabla
Recibe la tabla y borrar todas las filas
*/
function limpiarTabla(selector) {
    let rows = $(selector);
    for (let i = 1; i < rows.length; i++) {
        const element = rows[i];
        element.remove();
    }
}

/*
Metodo: actualizarCliente
Obtiene los valores de la tabla detalle y luego 
envia una peticion HTTP/PUT para actualizar el registro
en la base de datos por medio de la API REST
*/
function actualizarCliente(element) {
    let id = $(element).parent().parent().find('td').html();
    let rows = $("#tablaClienteEditar td");
    console.log("LLEGAR A ACTUALIZAR CLIENTE");
    let datosObject = {
        id: id,
        name: $(rows[1]).children().val(),
        email: $(rows[2]).children().val(),
        age: $(rows[3]).children().val()
    };

    $.ajax({
        url: URL_CLIENTE,
        data: JSON.stringify(datosObject),
        type: "PUT",
        contentType: "application/JSON",
        success: function (respuestaCliente) {
            $("#mensajes").html("El cliente con id: " + id + " fue actualizado exitosamente");
        },
        error: function (xhr, status) {
            $("#mensajes").html("Error POST" + status);
        }
    });

    limpiarTabla("#tablaCliente tr");
    setTimeout(
        function () {
            obtenerTodosLosClientes();
        }, 200);
    limpiarTabla("#tablaClienteEditar tr");
}

/*
Metodo: crear Cliente
Obtiene los valores de la tabla crear y luego 
envia una peticion HTTP/POST para crear el registro
en la base de datos por medio de la API REST
*/
function crearCliente() {
    let rows = $("#tablaClienteCrear td");
    //console.log("hola");
    let datosObject = {
        id: $(rows[0]).children().val(),
        name: $(rows[1]).children().val(),
        email: $(rows[2]).children().val(),
        age: $(rows[3]).children().val()
    };

    $.ajax({
        url: URL_CLIENTE,
        data: JSON.stringify(datosObject),
        type: "POST",
        contentType: "application/JSON",
        success: function (respuestaCliente) {
            //console.log(respuestaCliente);
            $(rows[0]).children().val("");
            $(rows[1]).children().val("");
            $(rows[2]).children().val("");
            $(rows[3]).children().val("");

            $("#mensajes").html("El CLIENTE con id: " + datosObject.id + " fue creado exitosamente");
            limpiarTabla("#tablaCliente tr");
            setTimeout(
                function () {
                    obtenerTodosLosClientes();
                }, 200);
        },
        error: function (xhr, status) {
            $("#mensajes").html("Error POST" + status);
        }
    });
}



///////////LOGICA PROGRAMACION PARA MENSAJE///////////////////
//Comentario agregado para rama develop