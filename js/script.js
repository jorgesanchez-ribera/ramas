const errortext = document.getElementById("errortext");
const errordate = document.getElementById("errordate");
const errorcolor = document.getElementById("errorcolor");

const btnrojo = document.getElementById("red");
const btnnaranja = document.getElementById("orange");
const btnverde = document.getElementById("green");

const buttons = document.getElementById("buttons");
const btnaniadir = document.getElementById("btnaniadir");
const tasks = document.getElementById("tasks");

const texttask = document.getElementById("texttask");
const datetask = document.getElementById("datetask");

let crono;
let boxborderelement = null;


const getHourToShow = (timetoend) => {
    // dias
    let hourtoshow = Math.floor(timetoend / (3600 * 24)) + "D";
    // horas
    hourtoshow += ":" + ("0" + Math.floor(timetoend / 3600 % 24)).slice(-2) + "H";
    // minutos
    hourtoshow += ":" + ("0" + Math.floor(timetoend / 60 % 60)).slice(-2) + "M";
    // segundos
    hourtoshow += ":" + ("0" + Math.floor(timetoend % 60)).slice(-2) + "S";

    return hourtoshow;
}

const addTask = () => {
    // Creación de la tarea
    let containertask = document.createElement("ARTICLE");
    containertask.classList.add("containertask");
    containertask.classList.add(boxborderelement.id);

    let checktask = document.createElement("INPUT");
    checktask.setAttribute("type", "checkbox")
    checktask.classList.add("containertask__checkbox");
    containertask.appendChild(checktask)

    let spantexttask = document.createElement("SPAN")
    spantexttask.classList.add("containertask__text");
    spantexttask.classList.add("containertask__text--description");
    spantexttask.textContent = texttask.value;
    containertask.appendChild(spantexttask)

    let spandatetask = document.createElement("SPAN")
    spandatetask.classList.add("containertask__text");
    spandatetask.classList.add("containertask__text--crono");
    containertask.appendChild(spandatetask);

    let imgcerrartask = document.createElement("IMG")
    imgcerrartask.setAttribute("src", "images/cerrar.svg")
    imgcerrartask.classList.add("containertask__img");
    containertask.appendChild(imgcerrartask)

    // Inserto la tarea en la primera posición después del título
    //de la tareas que es un elemento que ya existe y es el primero siempre.
    tasks.firstElementChild.after(containertask)

    // Lo ejecuto una vez fuera para que no haya delay
    let fecha_final = new Date(datetask.value);
    let timetoend = (fecha_final - new Date()) / 1000;
    spandatetask.textContent = getHourToShow(timetoend);

    // Dejo la función dentro por las variables y antes de la llamada ara que la función sea "local" a cada uno de los timer que se van generando
    const cronometro = () => {
        let timetoend = (fecha_final - new Date()) / 1000;

        if (timetoend > 0)
            spandatetask.textContent = getHourToShow(timetoend);
        else {
            clearInterval(crono);
            spandatetask.textContent = "TAREA FINALIZADA";
        }
    }

    crono = setInterval(cronometro, 1000);
}

// Se encarga de gestionar los errors que se producen, le pasamos el texto del error, etiqueta donde debe mostar el error y la etiqueta en la que se ha producido el error
const errorAction = (text, labeloutput, element) => {
    // texto que indica el error
    labeloutput.textContent = text;
    // añadimos para clase error cambia fondo de color
    element.classList.add("errorinput");
    // Pasamos el foco al campo del error
    element.focus();
}

const validateTask = () => {
    // Error descripcion vacia
    if (texttask.value == "") {
        let text = "Para crear una tarea debe introducir la descripción para la tarea";
        errorAction(text, errortext, texttask)
    } else {
        texttask.classList.remove("errorinput");
        if (texttask.value.length > 50) {
            text = "La descripción de la tarea no puede tener más de 50 caracteres"
            errorAction(text, errortext, texttask)
        } else {
            // Error fecha vacia
            if (datetask.value == "") {
                text = "Para crear una tarea debe introducir una fecha y una hora";
                errorAction(text, errordate, datetask);
            } else {
                texttask.classList.remove("errorinput");
                // error fecha menor que la fecha actual
                if ((new Date(datetask.value) - new Date()) < 0) {
                    text = "La fecha de la tarea no puede ser menor a la fecha actual";
                    errorAction(text, errordate, datetask)
                } else {
                    datetask.classList.remove("errorinput");
                    // Error selección prioridad
                    if (!boxborderelement) {
                        errorcolor.textContent = "Para crear una tarea debe seleccionar un color";
                    } else {
                        // Todo correcto
                        addTask();
                        texttask.value = "";
                        datetask.value = "";
                        boxborderelement.classList.remove("border")
                        texttask.focus();
                    }
                }
            }
        }
    } //fin del texto de la tarea 
}

const addBorder = (event) => {
    let element = event.target;
    let color = null;
    // Si hay algún elemento con borde se lo quito, hay que ponerlo
    //antes por si es la primera vez y no hay ninguno seleccionado
    // otra solución es un for dentro del if siguiente pero .....
    if (boxborderelement) { /* boxborderelement guarda el elemento seleccionado */
        boxborderelement.classList.remove("border")
    }

    if (element.nodeName === "DIV") {
        element.classList.add("border")
        color = element;
    }
    return color;
}

const clickTasks = (event) => {
    let element = event.target;
    if (element.nodeName == "IMG")
        element.parentElement.remove();

    if (element.nodeName == "INPUT") {
        element.nextElementSibling.nextElementSibling.remove();
        element.disabled = true;
    }
}

//para validar los datos 
btnaniadir.addEventListener("click", validateTask);

buttons.addEventListener("click", (event) => {
    //para poner el borde, devuelve el elemento al que le hemos puesto el borde
    boxborderelement = addBorder(event);
});

tasks.addEventListener("click", clickTasks);
document.addEventListener("keyup", (event) => {
    if (event.target.id == "texttask") {
        // Por si queremos que el texto salga en mayúsculas
        // texttask.value=texttask.value.toUpperCase();
        if (texttask.value.length > 50) {
            validateTask();
        } else {
            //Un poco pegote... 
            texttask.classList.remove("errorinput");
            errortext.innerHTML = "&nbsp;";
        }
    }
})