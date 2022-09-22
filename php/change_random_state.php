<?php

header('Content-type: application/json');

$data = array();

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $db->beginTransaction();

    $getRandomId = $db->query("SELECT * FROM module WHERE state != 0 ORDER BY RAND() LIMIT 1;");
    if ($getRandomId->rowCount() > 0) { //presence de module 
        $randomId = $getRandomId->fetch(PDO::FETCH_ASSOC); //recuperer un id aléatoire parmis les modules présents
        $randomModuleId = $randomId['id'];

        $randomState = rand(1, 2);

        //changer l'etat => en panne ou en marche d'un module aléatoire

        $stmt = $db->query("UPDATE module SET state = $randomState, starting_date = CURRENT_TIMESTAMP WHERE module.id = $randomModuleId AND module.state != $randomState");

        if ($randomState == 2) { //si le module devient en panne, retirer ses informations
            $stmt = $db->query("INSERT INTO history (id_module, temp, speed, passengers) VALUES ($randomModuleId, NULL, NULL, NULL)");
        }

        $db->commit();

        if (!$stmt) {
            // get error -> print_r($db->errorInfo()); 
            $data['error'] = "Une erreur est survenue.";
        } else {
            $data['success'] = "L'etat aléatoire a bien été modifié";
        }
    } else {
        $data['error'] = "Aucun module existant.";
    }
} else {
    $data['error'] = "Une erreur est survenue.";
}

echo json_encode($data);
