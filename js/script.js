const form = document.getElementById("form");
const submitbtn = document.getElementById("submit");
const moduleList = document.querySelector(".module-list");

const stateBtn = document.getElementById("reload-state");
const refreshbtn = document.getElementById("refreshbtn");
let refresh = true;

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
  //Ajax, ajout du module
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
        //html pour chaque module
        if (module.state === 2 || module.state === 0) {
          //module en panne ou éteint donc ne pas afficher le timer
          output = [
            ...output,
            `<div class='card ${
              module.state === 2 ? "background-red" : "background-gray"
            } 
            module-${module.id}'>
              <div class='card-body'>
                <h5 class='card-title'>${
                  module.name
                }<span class='indicator state-${module.state}'></span></h5>
                <div class="card-text">
                  <p>Vitesse : ${module.speed}</p>
                  <p>Temperature : ${module.temp}</p>
                  <p>Passagers : ${module.passengers}</p>
                </div>
                <button class='btn ${
                  module.state == 2 ? "btn-danger" : "btn-light"
                }' onclick='changeState(${module.id})'>redemarrer</button>
              </div>
            </div>`,
          ];
        } else {
          output = [
            ...output,
            `<div class='card module-${module.id}'>
              <div class='card-body'>
              <h5 class='card-title'>${module.name}<span class='indicator state-${module.state}'></span></h5>
                <div class="card-text">
                  <p>Vitesse : ${module.speed}</p>
                  <p>Temperature : ${module.temp}</p>
                  <p>Passagers : ${module.passengers}</p>
                </div>
                <button class='btn btn-light' onclick='changeState(${module.id})'>éteindre</button>
              </div>
            </div>`,
          ];
        }
      });
      //conversion du tableau vers une chaine de caractères sans virgules.
      moduleList.innerHTML = output.join("");
    }
  }
};
xhr.send();

//rafraichir les infos toutes les 1000ms
setInterval(() => {
  if (!refresh) {
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

            if (module.state == 2 || module.state == 0) {
              //module en panne ou éteint donc ne pas afficher le timer
              output = [
                ...output,
                `<div class='card ${
                  module.state == 2 ? "background-red" : "background-gray"
                } 
                module-${module.id}'>
                  <div class='card-body'>
                    <h5 class='card-title'>${
                      module.name
                    }<span class='indicator state-${module.state}'></span></h5>
                    <h6 class="card-subtitle timer mb-2 text-muted">${
                      module.state == 2 ? "En panne" : "Éteint"
                    }</h6>
                    <div class="card-text">
                      <p>Vitesse : ${module.speed}</p>
                      <p>Temperature : ${module.temp}</p>
                      <p>Passagers : ${module.passengers}</p>
                    </div>
                    <button class='btn ${
                      module.state == 2 ? "btn-danger" : "btn-light"
                    }' onclick='changeState(${module.id})'>redemarrer</button>
                  </div>
                </div>`,
              ];
            } else {
              output = [
                ...output,
                `<div class='card module-${module.id}'>
                  <div class='card-body'>
                    <h5 class='card-title'>${module.name}<span class='indicator state-${module.state}'></span></h5>
                    <h6 class="card-subtitle timer mb-2 text-muted">${timer}</h6>
                    <div class="card-text">
                      <p>Vitesse : ${module.speed}</p>
                      <p>Temperature : ${module.temp}</p>
                      <p>Passagers : ${module.passengers}</p>
                    </div>
                    <button class='btn btn-light' onclick='changeState(${module.id})'>éteindre</button>
                  </div>
                </div>`,
              ];
            }
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
  let hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  //recuperer les minutes
  let minutes = parseInt(seconds / 60);
  //recuperer les secondes restantes
  seconds = Math.trunc(seconds % 60);

  if (hours < 1) {
    return minutes + " m " + seconds + " s";
  } else {
    return hours + " h " + minutes + " m " + seconds + " s";
  }
}

//script pour changer l'etat aléatoirement
function changeRandomState() {
  //Ajax, ajout du module
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "./php/change_random_state.php", true);
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
  xhr.send();

  var min = 5,
    max = 30;
  var rand = Math.floor(Math.random() * (max - min + 1) + min); //generer nombre aleatoire entre 5 et 30
  console.log("Wait for " + rand + " seconds");
  setTimeout(changeRandomState, rand * 1000);
}

// setTimeout(changeRandomState, 5000);

// function changeState() {
//   let xhr = new XMLHttpRequest();
//   xhr.open("POST", "./php/change_state.php", true);
//   xhr.onload = () => {
//     if (xhr.readyState === XMLHttpRequest.DONE) {
//       if (xhr.status === 200) {
//         let data = xhr.response;
//         console.log(data);
//         if (data == "success") {
//           //php return success
//         } else {
//           //php return an error
//         }
//       }
//     }
//   };
//   xhr.send();
// }
