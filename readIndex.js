function onLoad(){
    if(window.localStorage.getItem("Productos")===null)
        cargarProductos();
    if(window.localStorage.getItem("Personas")===null)
        cargarPersonas();
    if(window.localStorage.getItem("Entidades")===null)
        cargarEntidades();
    if(window.localStorage.getItem("x")===null || window.localStorage.getItem("y")===null || window.localStorage.getItem("z")===null)
        cargarUsuarios();
    if(window.localStorage.getItem("logged")===null) window.localStorage.setItem("logged", false);

    check_Status();
}
function check_Status(){
    if (window.localStorage.getItem("logged") == "true")
        logged_index();
    else   
        showed_index();
}
function showed_index(){
    let main = vaciarMain();
    cambiarTituloPrincipal("Anales de la Ciencia");
    hacerLogin();
    generateList("Productos", false);
    generateList("Personas", false);
    generateList("Entidades", false);

}
function logged_index(){
    let main = vaciarMain();
    cambiarTituloPrincipal("Anales de la Ciencia");
    hacerLogout();
    generateList("Productos", true);
    generateList("Personas", true);
    generateList("Entidades", true);
}
function hacerLogin(){
    let div = document.getElementById("loginSpace");
    div.innerHTML = "";
    let form = document.createElement("form");
    div.appendChild(form);
    let label = document.createElement("label");
    form.appendChild(label);
    label.appendChild(document.createTextNode("Usuario"));
    let input = document.createElement("input");
    form.appendChild(input);
    input.type = "text";
    input.id = "user"; 
    let labelP = document.createElement("label");  
    form.appendChild(labelP);
    labelP.appendChild(document.createTextNode("Contraseña"));
    let inputP = document.createElement("input");
    form.appendChild(inputP);
    inputP.type = "password";
    inputP.id = "password";
    let button = document.createElement("button");
    form.appendChild(button);
    button.setAttribute('onclick', 'comprobarLogin()');
    button.appendChild(document.createTextNode("Login"));
}
function comprobarLogin(){
    let user = document.getElementById('user').value;
    let password = document.getElementById('password').value;

    text = "Usuario y/o contraseña no válido";
    if (window.localStorage.getItem(user) == password){
        window.localStorage.setItem("logged", true);
        logged_index();
    }
    else {
        window.alert(text);
        showed_index();
    }
}
function hacerLogout(){
    let div = document.getElementById("loginSpace");
    div.innerHTML ="";
    let form = document.createElement("form");
    div.appendChild(form);
    let button = document.createElement("button");
    form.appendChild(button);
    button.setAttribute('onclick', 'onLogout()');
    button.appendChild(document.createTextNode("Logout"));
}
function onLogout(){
    window.localStorage.setItem("logged", false);
    showed_index();
}
function cargarProductos(){
    let obj = [];
    let p1 = {"Index": 1, "Nombre": "SGML","Fecha de Nacimiento": "1960-10-22","Fecha de Defunción": "",
                "img" : "https://i.imgur.com/1BaqfUs.png","wiki": "https://es.wikipedia.org/wiki/SGML","Personas": [1],"Entidades": [1,3]};
    let p2 = {"Index": 2, "Nombre": "XML","Fecha de Nacimiento": "1999-09-12","Fecha de Defunción": "",
                "img" : "https://i.imgur.com/MB7rhqp.jpg","wiki": "https://es.wikipedia.org/wiki/Extensible_Markup_Language","Personas": [3,2],"Entidades": [3]};
    let p3 ={"Index": 3,"Nombre": "HTML","Fecha de Nacimiento": "1993-01-27","Fecha de Defunción": "",
                "img" : "https://i.imgur.com/cXmMM7X.jpg","wiki": "https://es.wikipedia.org/wiki/HTML","Personas": [1,2],"Entidades": [2]};
    obj.push(p1);
    obj.push(p2);
    obj.push(p3);
    window.localStorage.setItem("indexProductos", 3);
    obj = JSON.stringify(obj);
    window.localStorage.setItem("Productos", obj);
}
function cargarPersonas(){
    let obj = [];
    let p1 = {"Index": 1, "Nombre": "Tim Berners Lee","Fecha de Nacimiento": "11955-06-08","Fecha de Defunción": "",
                "img" : "https://i.imgur.com/RECNDCj.jpg","wiki": "https://es.wikipedia.org/wiki/Tim_Berners-Lee"};
    let p2 = {"Index": 2, "Nombre": "Vannervar Bush","Fecha de Nacimiento": "1890-03-11","Fecha de Defunción": "1974-06-28",
                "img" : "https://i.imgur.com/GSg04Kb.jpg","wiki": "https://es.wikipedia.org/wiki/Vannevar_Bush"};
    let p3 ={"Index": 3,"Nombre": "Bill Gates","Fecha de Nacimiento": "1955-10-28","Fecha de Defunción": "",
                "img" : "https://i.imgur.com/3T8CFlE.jpg","wiki": "https://es.wikipedia.org/wiki/Bill_Gates"};
    obj.push(p1);
    obj.push(p2);
    obj.push(p3);
    obj = JSON.stringify(obj);
    window.localStorage.setItem("indexPersonas",3);
    window.localStorage.setItem("Personas", obj);
}
function cargarEntidades(){
    let obj = [];
    let p1 = {"Index": 1, "Nombre": "IBM","Fecha de Nacimiento": "1911-06-16","Fecha de Defunción": "1998-00-22",
                "img" : "https://i.imgur.com/aJ9oYo8.jpg","wiki": "https://es.wikipedia.org/wiki/IBM", "Personas": [2]};
    let p2 = {"Index": 2, "Nombre": "CERN","Fecha de Nacimiento": "1954-09-29","Fecha de Defunción": "1974-06-28",
                "img" : "https://i.imgur.com/aZxU4ZB.jpg","wiki": "https://es.wikipedia.org/wiki/Organización_Europea_para_la_Investigación_Nuclear", "Personas": [1]};
    let p3 ={"Index": 3,"Nombre": "W3C","Fecha de Nacimiento": "1994-10-01","Fecha de Defunción": "",
                "img" : "https://i.imgur.com/Hib4l1f.jpg","wiki": "https://i.imgur.com/d4kANxJ.png","Personas": [3]};
    let p4 ={"Index": 4,"Nombre": "Microsoft","Fecha de Nacimiento": "1975-04-04","Fecha de Defunción": "",
                "img" : "https://i.imgur.com/d4kANxJ.png","wiki": "https://es.wikipedia.org/wiki/Microsoft","Personas": [3]};
    obj.push(p1);
    obj.push(p2);
    obj.push(p3);
    obj.push(p4);
    obj = JSON.stringify(obj);
    window.localStorage.setItem("indexEntidades", 4);
    window.localStorage.setItem("Entidades", obj);

}
function cargarUsuarios(){
    window.localStorage.setItem("x", "x");
    window.localStorage.setItem("y", "y");
    window.localStorage.setItem("z", "z");
}