function generateList(title, logged){
    let elements = window.localStorage.getItem(title);
    elements = JSON.parse(elements);
    let main = document.getElementById("pagina");
    let div = document.createElement("div");
    main.appendChild(div);
    div.id = title;
    div.setAttribute("class", "lista");
    let h2 = document.createElement("h2");
    div.appendChild(h2);
    h2.appendChild(document.createTextNode(title));
    if (logged)
        div.appendChild(aniadirBotonAdd());
    let ul = document.createElement("ul");
    div.appendChild(ul);
    for(let element of elements){        
        ul.appendChild(imprimirElementoEnLista(element, logged));
    }
}
function editElement(event, elemJSON){
    let main = vaciarMain();
    cambiarTituloPrincipal("Anales de la Ciencia");
    let div = document.createElement("div");
    main.appendChild(div);
    div.setAttribute("class", "formulario");
    div.name =elemJSON;
    let porDefecto = false;
    let actionToDo = event.target.name;
    let index, valores;
    if (actionToDo != "add"){
        index = event.target.title;
        div.id=index; 
        let listaElem = window.localStorage.getItem(elemJSON);
        listaElem = JSON.parse(listaElem);
        valores = listaElem.find(element => element.Index == index);
        porDefecto = true;
    }
    div.appendChild(generarFormulario(valores, porDefecto,elegirLista(elemJSON)));
    div.appendChild(aniadirBotonGuardar(porDefecto, elemJSON, index));
}
function aniadirElem(event){
    let elemJSON = event.target.name;
    let listaElem = window.localStorage.getItem(event.target.name);
    let elem;
    let nuevo = false;
    listaElem = JSON.parse(listaElem);
    if(event.target.value == "add"){
        nuevo = true;
        index = incrementarIndex(elemJSON);
        elem = {};
        elem.Index = index;
    }
    else {
        let index = event.target.title;
        elem = listaElem.find(element => element.Index == index);
    }
    actualizarDatos(elem, elemJSON);
    if(nuevo) {
        listaElem.push(elem);
        window.alert("¡Añadido correctamente!");
    } 
    else
        window.alert("¡Actualizado correctamente!");
    
    listaElem = JSON.stringify(listaElem);
    window.localStorage.setItem(elemJSON, listaElem);
}
function actualizarDatos(elem, elemJSON){
    elem.Nombre = document.getElementById("Nombre").value;
    elem["Fecha de Nacimiento"]= document.getElementById("Fecha de Nacimiento").value;
    elem["Fecha de Defunción"] = document.getElementById("Fecha de Defunción").value;
    elem.img = document.getElementById("img").value;
    elem.wiki = document.getElementById("wiki").value;
    if (elemJSON == "Productos" || elemJSON == "Entidades")
        elem.Personas = construirArrayReferencias(document.getElementsByName("Personas"), event.target.parentElement.id, "Personas");
    if (elemJSON == "Productos")
        elem.Entidades = construirArrayReferencias(document.getElementsByName("Entidades"), event.target.parentElement.id,"Entidades");
}
function incrementarIndex(elemJSON){
    let Nindex = "index"+elemJSON;
    let index = window.localStorage.getItem(Nindex);
    index++;
    window.localStorage.setItem(Nindex, index);
    return index;
}
function deleteElem(event){
    var elemJSON = event.target.parentElement.parentElement.parentElement.id;
    var listaElem = window.localStorage.getItem(elemJSON);
    listaElem = JSON.parse(listaElem);
    var objetoID = event.target.parentElement.id;
    if (elemJSON == 'Personas'){
        eliminarReferencias("Productos", "Personas", objetoID);
        eliminarReferencias("Entidades", "Personas", objetoID);
    }
    if(elemJSON == 'Entidades')
        eliminarReferencias("Productos", "Entidades", objetoID);
    var idx = listaElem.findIndex(element => element.Index == objetoID); 
    if(idx!=-1) listaElem.splice(idx, 1);
    listaElem = JSON.stringify (listaElem);
    window.localStorage.setItem(elemJSON, listaElem);
    logged_index();
}
function loadElement(idx, elemJSON){
    let listaElem = window.localStorage.getItem(elemJSON);
    listaElem = JSON.parse(listaElem); 
    let valores = listaElem.find(element => element.Index == idx);
    let main = vaciarMain();
    cambiarTituloPrincipal(valores.Nombre);
    let div = document.createElement("div");
    main.appendChild(div);
    div.setAttribute("class", "elemento");
    let divElem = document.createElement("div");
    div.appendChild(divElem);
    divElem.setAttribute("class", "datos");
    for (valor in valores){
        if (valor == "img")
            div.appendChild(aniadirImagenElemento(valores[valor]));
        else if (valor == "wiki")
            div.appendChild(aniadirWikiElemento(valores[valor]));
        else if (valor == "Fecha de Nacimiento" || valor =="Fecha de Defunción" || valor =="Nombre")
            divElem.appendChild(aniadirTextoElemento(valor, valores[valor]));
    }
    div.appendChild(construirListaReferencias(idx, elemJSON));
    div.appendChild(aniadirBotonVolverIndex());

}
function construirListaReferencias(idx, elemJSON) {
    let listaReferencias1 = new Array();
    let listaReferencias2 = new Array();
    let ref1 = "";
    let ref2 = "";
    if (elemJSON == 'Productos'){
        listaReferencias1 = obtenerNombresDeLista('Productos', 'Personas', idx);
        listaReferencias2 = obtenerNombresDeLista('Productos', 'Entidades', idx);
        ref1 = 'Personas';
        ref2 = 'Entidades';
    }
    else if(elemJSON == 'Entidades'){
        listaReferencias1 = obtenerNombresDeLista('Entidades', 'Personas', idx);
        listaReferencias2 = obtenerElementosReferenciados ('Entidades', 'Productos', idx);
        ref1 = 'Personas';
        ref2 = 'Productos';
    }
    else {
        listaReferencias1 = obtenerElementosReferenciados ('Personas', 'Productos', idx);
        listaReferencias2 = obtenerElementosReferenciados ('Personas', 'Entidades', idx);
        ref1 = 'Productos';
        ref2 = 'Entidades';

    }
    return imprimirListaReferencias (ref1, ref2, listaReferencias1, listaReferencias2);
}
function obtenerNombresDeLista(elemJSON, elemJSONReferenciado, idx){
    let listaElemJSON = JSON.parse(window.localStorage.getItem(elemJSON));
    let listaReferenciada = JSON.parse(window.localStorage.getItem(elemJSONReferenciado));
    let valores = listaElemJSON.find(element => element.Index == idx);
    let array = valores[elemJSONReferenciado];
    let listaRef = new Array();
    if(array != undefined){
        for (elem in array){
            var elemento = listaReferenciada.find(element => element.Index == array[elem]); 
            listaRef.push(elemento);
        }
    }
    return listaRef;
}
function obtenerElementosReferenciados(elemJSON, elemJSONReferenciado, idx){
    let listaReferenciada = JSON.parse(window.localStorage.getItem(elemJSONReferenciado));
    let listaRef = new Array();
    for (elem in listaReferenciada){
        let listaEnt = listaReferenciada[elem];
        listaEnt = listaEnt[elemJSON];
        if (listaEnt != undefined){
            let indexEnt = listaEnt.findIndex(element => element == idx);
            if (indexEnt != -1) listaRef.push(listaReferenciada[elem]);
        }
    }
    return listaRef;
}
function imprimirListaReferencias(ref1, ref2, listaReferencias1, listaReferencias2){
    let ref = ref1;
    let div = document.createElement("div");
    div.setAttribute("class", "referencias");
    for(lista in arr = [listaReferencias1, listaReferencias2]){
        let divRef = document.createElement("div");
        divRef.setAttribute("class", "ref"+lista);
        div.appendChild(divRef);
        let span = document.createElement("span");
        divRef.appendChild(span);
        span.appendChild(document.createTextNode(ref));
        if(arr[lista] === undefined){
            divRef.appendChild(document.createTextNode("N/A"));
        }
        else {
            for (elem in lista = arr[lista]){
                let buttonList = document.createElement("button");
                divRef.appendChild(buttonList);
                buttonList.appendChild(document.createTextNode(lista[elem].Nombre));
                buttonList.id = lista[elem].Index;
                buttonList.title = ref;
                buttonList.setAttribute("onclick", "loadElement(event.target.id, event.target.title)");
            }
        }
        ref = ref2;
    }
    return div;
}
function elegirLista(nombre){
    switch(nombre){
        case "Productos": 
            var lista = ["Nombre", "Fecha de Nacimiento", "Fecha de Defunción", "img", "wiki", "Personas","Entidades"]; 
            break;
        case "Entidades": 
            var lista = ["Nombre", "Fecha de Nacimiento", "Fecha de Defunción", "img", "wiki", "Personas"];
            break;
        default:
            var lista = ["Nombre", "Fecha de Nacimiento", "Fecha de Defunción", "img", "wiki"];
            break;
    }
    return lista;
}
function eliminarReferencias (elemJSON, atributo, objetoID){
    var listaElem = window.localStorage.getItem(elemJSON);
    listaElem = JSON.parse(listaElem); 

    for (elem in listaElem){
        var valores = listaElem[elem];
        valores = valores[atributo];
        if(!(valores == undefined)){
            var idx = valores.findIndex(element => element == objetoID); 
            if(idx!=-1) valores.splice(idx, 1);
        }
    }
    listaElem = JSON.stringify (listaElem);
    window.localStorage.setItem(elemJSON, listaElem);
}
function construirArrayReferencias(elementos) {
    var lista = [];
    for (elem in elementos)
        if(elementos[elem].checked)
            lista.push(parseInt(elementos[elem].id));
    return lista;
}
function aniadirBotonAdd(){
    let divAdd = document.createElement("div");
    divAdd.setAttribute("class", "cajaAniadir");
    let button = document.createElement("button");
    divAdd.appendChild(button);
    button.appendChild(document.createTextNode("Añadir"));
    button.setAttribute("onclick", "editElement(event, event.target.parentElement.parentElement.id)");
    button.title = "add";
    button.name = "add";
    return divAdd;
}
function aniadirBotonUpdate(element){
    let buttonUpdate = document.createElement("button");
    buttonUpdate.appendChild(document.createTextNode("Actualizar"));
    buttonUpdate.setAttribute("onclick", "editElement(event, event.target.parentElement.parentElement.parentElement.id)");
    buttonUpdate.title = element.Index;
    buttonUpdate.name = "Update";
    return buttonUpdate;
}
function aniadirBotonDelete(){
    let buttonDelete = document.createElement("button");
    buttonDelete.appendChild(document.createTextNode("Borrar"));
    buttonDelete.setAttribute("onclick", "deleteElem(event)");
    buttonDelete.name = "delete";
    return buttonDelete;
}
function aniadirBotonGuardar(porDefecto, elemJSON, index){
    let button = document.createElement("button");
    button.appendChild(document.createTextNode("Guardar"));
    button.setAttribute("name", elemJSON);
    button.setAttribute("onclick", "aniadirElem(event)");
    if (porDefecto){
        button.setAttribute("title", index);
        button.value ="update";
    }
    else {
        button.value ="add";
    }
    return button;
}
function aniadirBotonVolverIndex(){
    let button = document.createElement("button");
    button.appendChild(document.createTextNode("Indice"));
    button.setAttribute("onclick", "showed_index()");
    return button;
}
function imprimirElementoEnLista(element, logged){
    let li = document.createElement("li");
    li.id = element.Index;
    li.name = element.Nombre;
    let img = document.createElement("img");
    li.appendChild(img);
    img.src = element.img;
    let span = document.createElement("span");
    li.appendChild(span);
    span.appendChild(document.createTextNode(element.Nombre));
    span.title = element.Nombre;
    if(logged){
        li.appendChild(aniadirBotonUpdate(element));
        li.appendChild(aniadirBotonDelete());
    } else
        span.setAttribute("onclick", "loadElement(event.target.parentElement.id, event.target.parentElement.parentElement.parentElement.id)");
   return li;
}
function generarFormulario(valores, porDefecto, lista){
    let form = document.createElement("form");
    form.id = "formulario";
    for (campo in lista){
        var divRow = document.createElement("div");
        form.appendChild(divRow);
        var label = document.createElement("label");
        divRow.appendChild(label);
        label.appendChild(document.createTextNode(lista[campo]));
        if (lista[campo] == "Fecha de Nacimiento" || lista[campo] == "Fecha de Defunción") 
            divRow.appendChild(aniadirInputFecha(valores,lista[campo], porDefecto));
        else if (lista[campo] == "wiki" || lista[campo] =="img")
            divRow.appendChild(aniadirInputURL(valores,lista[campo], porDefecto));
        else if(lista[campo] == "Personas" || lista[campo] == "Entidades")
            divRow.appendChild(aniadirInputChecklist(valores, lista[campo], porDefecto));
        else 
            divRow.appendChild(aniadirInputText(valores, lista[campo],porDefecto));
    }
    return form;
}
function aniadirInputFecha(valores,elemJSON, porDefecto){
    let input = document.createElement("input");
    input.placeholder = "YYYY-MM-DD";
    input.id = elemJSON;
    if (porDefecto == true)
        input.value = valores[elemJSON];
    input.pattern = "(?:19|20)\[0-9\]{2}-(?:(?:0\[1-9\]|1\[0-2\])/(?:0\[1-9\]|1\[0-9\]|2\[0-9\])|(?:(?!02)(?:0\[1-9\]|1\[0-2\])/(?:30))|(?:(?:0\[13578\]|1\[02\])-31))";
    return input;
}
function aniadirInputURL(valores, elemJSON, porDefecto){
    let input = document.createElement("input");
    input.id = elemJSON;
    input.type = "url";
    if (porDefecto == true)
        input.value = valores[elemJSON];
    return input;
}
function aniadirInputChecklist(valores, elemJSON, porDefecto){
    let listaCheck = window.localStorage.getItem(elemJSON);
    listaCheck = JSON.parse(listaCheck);
    let divLabel = document.createElement("div");
    divLabel.setAttribute("class", "labelCheck");
    divLabel.id = elemJSON;
    for (elem in listaCheck){
        let inputCheck = document.createElement("input");
        divLabel.appendChild(inputCheck);
        inputCheck.type = "checkbox";
        inputCheck.value = listaCheck[elem].Nombre;
        inputCheck.id = listaCheck[elem].Index;
        inputCheck.name = elemJSON;
        if (porDefecto && valores[elemJSON] != undefined)
            inputCheck.checked = valores[elemJSON].includes(listaCheck[elem].Index);
        let labelCheck = document.createElement("label");
        divLabel.appendChild(labelCheck);
        labelCheck.appendChild(document.createTextNode(listaCheck[elem].Nombre));
    }
    return divLabel;
}
function aniadirInputText(valores, elemJSON, porDefecto){
    let input = document.createElement("input");
    input.type = "text";
    input.id = elemJSON;
    if (porDefecto == true)
        input.value = valores[elemJSON];
    return input;
}
function aniadirImagenElemento(link){
    let imgElem = document.createElement("img");
    imgElem.src = link;
    return imgElem;
}
function aniadirWikiElemento(url){
    let link = document.createElement("a");
    link.href = url;   
    link.appendChild(document.createTextNode("Wikipedia")); 
    return link;
}
function aniadirTextoElemento(etiqueta, valor) {
    var span = document.createElement("span");
    span.appendChild(document.createTextNode(etiqueta +": "));
    var b = document.createElement("b");
    span.appendChild(b);
    if (valor== "")
        b.appendChild(document.createTextNode("N/A"));
    else
        b.appendChild(document.createTextNode(valor));
    return span;
}
function cambiarTituloPrincipal(nuevoTitulo){
    let tp = document.getElementById("tituloPrincipal");
    tp.innerHTML = "";
    tp.appendChild(document.createTextNode(nuevoTitulo));
}
function vaciarMain(){
    let main = document.getElementById("pagina");
    main.innerHTML = "";
    return main;
}


