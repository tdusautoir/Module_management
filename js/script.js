const form = document.getElementById("form");
const submitbtn = document.getElementById("submit");
const moduleList = document.querySelector(".module-list");

const refreshbtn = document.getElementById("refreshbtn");
let refresh = true;

let starting_dates = [];

//button de rafraichissement
refreshbtn.onclick = (e) => {
  e.preventDefault(); //empecher le comportement par defaut
  if (refresh) {
    refresh = false;
    refreshbtn.innerHTML = "Play";
  } else {
    refresh = true;
    refreshbtn.innerHTML = "Pause";
  }
};

form.onsubmit = (e) => {
  e.preventDefault(); //empecher le comportement par defaut
};

submitbtn.onclick = () => {
  //Ajax for req
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "./php/add_module.php", true);
  xhr.onload = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let data = xhr.response;
        console.log(data);
        if (data == "success") {
          //php return success
        } else {
          //php return an error
        }
      }
    }
  };

  //envoyer les informations du formulaires via php
  let formData = new FormData(form); //recuperer les informations
  xhr.send(formData);
};

//recuperer les infos
let xhr = new XMLHttpRequest();
xhr.open("GET", "./php/get_module.php", true);
xhr.onload = () => {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    if (xhr.status === 200) {
      //recuperer les données au format json
      let jsondata = JSON.parse(xhr.responseText);
      console.log(jsondata);

      //afficher les données
      let output = [];
      jsondata.map((module) => {
        //recuperer les dates de demarrage de tous les modules dans un tableau pour initialiser les timers
        starting_dates = [...starting_dates, module.starting_date];
        //html pour chaque module
        output = [
          ...output,
          `<div class='card module-${module.id}'><div class='card-body'>
          <h5 class='card-title'>${module.name}</h5>
          </div></div>`,
        ];
      });
      console.log(starting_dates);
      //conversion du tableau vers une chaine de caractères sans virgules.
      moduleList.innerHTML = output.join("");
    }
  }
};
xhr.send();

//rafraichir les infos toutes les 1000ms
setInterval(() => {
  if (refresh) {
    //rafraichissement est activé
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "./php/get_module.php", true);
    xhr.onload = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          //recuperer les données en json
          let jsondata = JSON.parse(xhr.responseText);

          //afficher les données
          let output = [];
          jsondata.map((module) => {
            //recuperer le moment ou le module a été démarré
            var startingDate = new Date(
              module.starting_date.replace(/-/g, "/")
            );
            var currentDate = new Date();
            var time = new Date(currentDate.getTime() - startingDate.getTime());
            var timer = msToHMS(time.getTime());

            output = [
              ...output,
              `<div class='card module-${module.id}'><div class='card-body'><h5 class='card-title'>${module.name}</h5><p>${timer}</p></div></div>`,
            ];
          });
          //conversion du tableau vers une chaine de caractères sans virgules.
          moduleList.innerHTML = output.join("");
        }
      }
    };
    xhr.send();
  }
}, 1000);

//millisecondes vers hh:mm:ss
function msToHMS(ms) {
  //convertir en secondes
  let seconds = ms / 1000;
  //recuperer les heures
  const hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  //recuperer les minutes
  const minutes = parseInt(seconds / 60);
  //recuperer les secondes restantes
  seconds = Math.trunc(seconds % 60);

  return hours + " h " + minutes + " m " + seconds;
}
