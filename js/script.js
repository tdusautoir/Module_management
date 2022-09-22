const form = document.getElementById("form");
const submitbtn = document.getElementById("submit");
const moduleList = document.querySelector(".module-list");
const historyList = document.querySelector(".history-list");
const refreshbtn = document.getElementById("refreshbtn");
const modal = document.getElementById("modal");
let refresh = false;

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
        let jsondata = JSON.parse(xhr.responseText);
        // console.log(jsondata);
        DisplayModal(jsondata.success, "success");
        if (jsondata.error != undefined) {
          DisplayModal(jsondata.error, "error");
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
      // console.log(jsondata);

      //afficher les modules
      let output = [];

      if (jsondata.error == undefined) {
        jsondata.map((module) => {
          //html pour chaque module
          if (module.state === 2 || module.state === 0) {
            //module en panne ou éteint donc ne pas afficher le timer
            output = [
              ...output,
              `<div class='card ${
                module.state === 2 ? "background-red" : "background-gray"
              } module-${module.id}'>
              <div class='card-body'>
                <h5 class='card-title'>${
                  module.name
                }<span class='indicator state-${module.state}'></span></h5>
                <div class="card-text">
                  <p>Vitesse : ${
                    module.speed === null ? "null" : module.speed + " km/h"
                  }</p>
                  <p>Temperature : ${
                    module.temp === null ? "null" : module.temp + " °C"
                  }</p>
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
              <h5 class='card-title'>${
                module.name
              }<span class='indicator state-${module.state}'></span></h5>
                <div class="card-text">
                  <p>Vitesse : ${
                    module.speed === null ? "null" : module.speed + " km/h"
                  }</p>
                  <p>Temperature : ${
                    module.temp === null ? "null" : module.temp + " °C"
                  }</p>
                  <p>Passagers : ${module.passengers}</p>
                </div>
                <button class='btn btn-light' onclick='changeState(${
                  module.id
                })'>éteindre</button>
              </div>
            </div>`,
            ];
          }
        });
      } else {
        output = [`<p>${jsondata.error}</p>`];
      }
      //conversion du tableau vers une chaine de caractères sans virgules et les inserer dans moduleList.
      moduleList.innerHTML = output.join("");
    }
  }
};
xhr.send();

//rafraichir les infos toutes les time ms
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
          // console.log(jsondata);

          //afficher les modules
          let output = [];

          if (jsondata.error == undefined) {
            jsondata.map((module) => {
              //recuperer le moment ou le module a été démarré
              var startingDate = new Date(
                module.starting_date.replace(/-/g, "/")
              );
              var currentDate = new Date();
              var time = new Date(
                currentDate.getTime() - startingDate.getTime()
              );
              var timer = msToHMS(time.getTime());

              if (module.state == 2 || module.state == 0) {
                //module en panne ou éteint donc ne pas afficher le timer
                output = [
                  ...output,
                  `<div class='card ${
                    module.state == 2 ? "background-red" : "background-gray"
                  } module-${module.id}'>
                  <div class='card-body'>
                    <h5 class='card-title'>${
                      module.name
                    }<span class='indicator state-${module.state}'></span></h5>
                    <h6 class="card-subtitle timer mb-2 text-muted">${
                      module.state == 2 ? "En panne" : "Éteint"
                    }</h6>
                    <div class="card-text">
                      <p>Vitesse : ${
                        module.speed === null ? "null" : module.speed + " km/h"
                      }</p>
                      <p>Temperature : ${
                        module.temp === null ? "null" : module.temp + " °C"
                      }</p>
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
                    <h5 class='card-title'>${
                      module.name
                    }<span class='indicator state-${module.state}'></span></h5>
                    <h6 class="card-subtitle timer mb-2 text-muted">${timer}</h6>
                    <div class="card-text">
                      <p>Vitesse : ${
                        module.speed === null ? "null" : module.speed + " km/h"
                      }</p>
                      <p>Temperature : ${
                        module.temp === null ? "null" : module.temp + " °C"
                      }</p>
                      <p>Passagers : ${module.passengers}</p>
                    </div>
                    <button class='btn btn-light' onclick='changeState(${
                      module.id
                    })'>éteindre</button>
                  </div>
                </div>`,
                ];
              }
            });
          } else {
            output = [`<p>${jsondata.error}</p>`];
          }
          //conversion du tableau vers une chaine de caractères sans virgules et les inserer dans moduleList.
          moduleList.innerHTML = output.join("");
        }
      }
    };
    xhr.send();
  }
}, 2000);

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
  if (refresh) {
    //Ajax, ajout du module
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "./php/change_random_state.php", true);
    xhr.onload = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          //recuperer les données au format json
          console.log(xhr.responseText);
          let jsondata = JSON.parse(xhr.responseText);
          // console.log(jsondata);
          if (jsondata.error != undefined) {
            DisplayModal(jsondata.error, "error");
          } else if (jsondata.success_1) {
            //Un module aléatoire est réparé
            DisplayModal(jsondata.success_1, "success");
          } else {
            //Un module aléatoire est devenu en panne
            DisplayModal(jsondata.success_2, "error");
          }
        }
      }
    };
    xhr.send();

    var min = 5,
      max = 20;
    var rand = Math.floor(Math.random() * (max - min + 1) + min); //generer nombre aleatoire entre 5 et 20
    setTimeout(changeRandomState, rand * 1000);
  }
}
setTimeout(changeRandomState, 5000);

//changer l'etat du module au click du bouton
function changeState(moduleId) {
  let xhr = new XMLHttpRequest();
  let url = "./php/change_state.php?id=" + moduleId;
  xhr.open("POST", url, true);
  xhr.onload = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let jsondata = JSON.parse(xhr.responseText);
        // console.log(jsondata);
        if (jsondata.error != undefined) {
          //erreur
        }
      }
    }
  };
  xhr.send();
}

//changer les valeurs des modules aléatoirement toutes les 3 secondes
setInterval(() => {
  if (refresh) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "./php/update_module.php", true);
    xhr.onload = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          let jsondata = JSON.parse(xhr.responseText);
          // console.log(jsondata);
          if (jsondata.error != undefined) {
            //erreur
          }
        }
      }
    };
    xhr.send();
  }
}, 3000);

// recuperer l'historique
let xhr2 = new XMLHttpRequest();
xhr2.open("GET", "./php/get_history.php", true);
xhr2.onload = () => {
  if (xhr2.readyState === XMLHttpRequest.DONE) {
    if (xhr2.status === 200) {
      let jsondata = JSON.parse(xhr2.responseText);

      //afficher l'historique
      let output = [];
      // console.log(jsondata);

      if (jsondata.error == undefined) {
        jsondata.map((module) => {
          let state = "";
          if (module.state == 2) {
            state = "en panne";
          } else if (module.state == 1) {
            state = "en marche";
          } else {
            state = "éteint";
          }

          output = [
            ...output,
            `<li>${
              " Module : '" +
              module.name +
              "' - " +
              module.date_history +
              " - temp: " +
              module.temp +
              ", vitesse: " +
              module.speed +
              ", passagers: " +
              module.passengers +
              ", état : " +
              state
            }</li>`,
          ];
        });
      } else {
        output = [`<p>${jsondata.error}</p>`];
      }

      // console.log(output);

      //conversion du tableau historique vers une chaine de caractères sans virgules et les inserer dans historyList
      historyList.innerHTML = output.join("");
    }
  }
};
xhr2.send();

//rafraichir les infos toutes les time ms
setInterval(() => {
  if (refresh) {
    let xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "./php/get_history.php", true);
    xhr2.onload = () => {
      if (xhr2.readyState === XMLHttpRequest.DONE) {
        if (xhr2.status === 200) {
          let jsondata = JSON.parse(xhr2.responseText);

          //afficher l'historique
          let output = [];
          // console.log(jsondata);

          if (jsondata.error == undefined) {
            jsondata.map((module) => {
              let state = "";
              if (module.state == 2) {
                state = "en panne";
              } else if (module.state == 1) {
                state = "en marche";
              } else {
                state = "éteint";
              }

              output = [
                ...output,
                `<li>${
                  " Module : '" +
                  module.name +
                  "' - " +
                  module.date_history +
                  " - temp: " +
                  module.temp +
                  ", vitesse: " +
                  module.speed +
                  ", passagers: " +
                  module.passengers +
                  ", état : " +
                  state
                }</li>`,
              ];
            });
          } else {
            output = [`<p>${jsondata.error}</p>`];
          }

          // console.log(output);

          //conversion du tableau historique vers une chaine de caractères sans virgules et les inserer dans historyList
          historyList.innerHTML = output.join("");
        }
      }
    };
    xhr2.send();
  }
}, 2000);

//function pour afficher la modal
function DisplayModal(text, type) {
  modal.className += ` active ${type}`;
  modal.innerHTML = `<p>${text}<p>`;

  //fermer la modal au bout de 4s
  setTimeout(() => {
    modal.className = "my-modal";
  }, 4000);
}
