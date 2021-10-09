//Moment 5 DT173G av Alice Fagerberg

"use strict";
//variabler
let listEl = document.getElementById("courselist");
let formHeading = document.getElementById("formheading");
let coursesHeading = document.getElementById("coursesheading");

let addButtonEl = document.getElementById("add");
let updateBtn = document.getElementById("update");

let message = document.getElementById("message");

let codeInput = document.getElementById("coursecode");
let nameInput = document.getElementById("cname");
let progressionInput = document.getElementById("progression");
let cPlanInput = document.getElementById("courseplan");

updateBtn.style.display = "none";
addButtonEl.style.display ="block";

//Händelselyssnare
window.addEventListener("load", getCourses);
addButtonEl.addEventListener("click", function(e){
    e.preventDefault();
    addCourse();
});


//funktioner

//Hämtar alla kurser och skriver ut
function getCourses(){
    listEl.innerHTML = "";

    fetch("https://afagerberg.se/webbutveckling3/coursesapi/coursesrest")
    .then(response => response.json())
    .then(data =>{
       data.forEach(course =>{
           listEl.innerHTML +=
           `<ul class="course">
                <li><strong>Kurskod: </strong> ${course.coursecode}</li>
                <li><strong>Kursnamn: </strong> ${course.cname}</li>
                <li><strong>Progression: </strong> ${course.progression}</li>
                <li><strong>Kursplan: </strong><a href="${course.courseplan}" target="_blank" >Webblänk </a></li>
                <li class="line"><button id="${course.id}" onclick="deleteCourse('${course.id}')">Radera</button>
                <button class="edit" onclick="getCourseById('${course.id}', '${course.coursecode}', '${course.cname}', '${course.progression}', '${course.courseplan}')">Redigera</button></li>
           </ul>`;
       }) 
    })
}

// Lägg till en kurs
function addCourse() {
    let coursecode = codeInput.value;
    let cname = nameInput.value;
    let progression = progressionInput.value;
    let courseplan = cPlanInput.value;
    
    let courseObj = {'coursecode': coursecode, 'cname': cname, 'progression': progression, 'courseplan': courseplan};
        
        fetch("https://afagerberg.se/webbutveckling3/coursesapi/coursesrest", {
            method: 'POST',
            body: JSON.stringify(courseObj),

        })
        .then(response => { 
            response.json()
            if(response.status === 400){
                message.style.color = "rgb(212, 25, 0)";
                message.innerHTML = "Du måste fylla i alla fält! - En kurskod, ett kursnamn, progression och en länk till kursplan";
            }else{
                if(response.status === 201) {
                    message.style.color = "green";
                    message.innerHTML = "En kurs lades till!";
                }else {
                    message.style.color = "rgb(212, 25, 0)";
                    message.innerHTML = "något gick fel...";
                }
            }
            
        })
        .then(data =>{
            getCourses();

            codeInput.value = "";
            nameInput.value = "";
            progressionInput.value = "";
            cPlanInput.value = "";

        })

        
        .catch(error => {
            console.log('Error', error);
        })
        
        
}

//Hämta specifik kurs, skriver ut i formuläret
function getCourseById(id, coursecode, cname, progression, courseplan) {

    document.getElementById("gotoadd").style.display = "none";
    document.getElementById("gotocourses").style.display = "none";

    formHeading.innerHTML = "Uppdatera kurs";

    window.scrollTo(0, 0);

    message.innerHTML = "";
    
    updateBtn.style.display = "block";
    addButtonEl.style.display ="none";

    codeInput.value = coursecode;
    nameInput.value = cname ;
    progressionInput.value = progression;
    cPlanInput.value = courseplan;

    // hämtar update vid klick
    updateBtn.addEventListener("click", function(e){

        e.preventDefault();
        updateCourse(id);

    });

}

//Uppdaterar specifik kurs från inputfält i formuläret, skriver ut...
function updateCourse(id) {
    
    //inputvariabler
    let coursecode = codeInput.value;
    let cname = nameInput.value;
    let progression = progressionInput.value;
    let courseplan =cPlanInput.value;
    
    let courseObj = {'coursecode': coursecode, 'cname': cname, 'progression': progression, 'courseplan': courseplan};
    
    // kollar input och hämtar
    if(coursecode == "" || cname == "" || progression == "" || courseplan == ""){
        message.style.color = "rgb(212, 25, 0)";
        message.innerHTML = "Du måste fylla i alla fält för att uppdatera kursen!";
    }else{
        fetch("https://afagerberg.se/webbutveckling3/coursesapi/coursesrest?id=" + id,{
        method:'PUT',
        headers:{
        'Content-Type':'application/json'
        },
        body:JSON.stringify(courseObj),

        })
        .then(response => {
            

                response.json()
                if(response.status === 200) {

                    message.style.color = "green";
                    message.innerHTML = "Kursen uppdaterades!";

                    id="";
                    codeInput.value = "";
                    nameInput.value = "";
                    progressionInput.value = "";
                    cPlanInput.value = "";

                    document.getElementById("gotoadd").style.display = "inline-block";
                    document.getElementById("gotocourses").style.display = "inline-block";
                    formHeading.innerHTML = "Lägg till kurs";
                    coursesHeading.innerHTML = "Kurser jag har läst";
                }else {
                    message.innerHTML = "något gick fel...";
                    message.style.color = "rgb(212, 25, 0)";
                }
            
            

        })
        .then(data =>{

            getCourses();

            updateBtn.style.display = "none";
            addButtonEl.style.display = "block";

        })


        .catch(error => {
            console.log('Error', error);
        })

        id="";
        codeInput.value = "";
        nameInput.value = "";
        progressionInput.value = "";
        cPlanInput.value = "";

        formHeading.innerHTML = "Lägg till kurs";
    }


}

// Raderar specifik kurs
function deleteCourse(id) {
    fetch("https://afagerberg.se/webbutveckling3/coursesapi/coursesrest?id=" + id, {
        method: 'DELETE',

    })
    .then(response =>{ 
        message.style.color = "green";
        message.innerHTML = "Kursen är raderad!";
        response.json() })
    .then(data =>{
        getCourses();
    })
    .catch(error => {
        console.log('Error', error);
    })
}