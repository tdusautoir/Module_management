<?php

header('Content-type: application/json');

$data = array();

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $db->beginTransaction();

    $randomState = rand(1, 2);

    $getRandomId = $db->query("SELECT * FROM module WHERE state != 0 AND state != $randomState ORDER BY RAND() LIMIT 1;");
    if ($getRandomId->rowCount() > 0) { //presence de module 
        $randomId = $getRandomId->fetch(PDO::FETCH_ASSOC); //recuperer un id aléatoire parmis les modules présents
        $randomModuleId = $randomId['id'];

        //changer l'etat => en panne ou en marche d'un module aléatoire
        $stmt = $db->query("UPDATE module SET state = $randomState, starting_date = CURRENT_TIMESTAMP WHERE module.id = $randomModuleId");

        if ($randomState == 2) { //si le module devient en panne, retirer ses informations
            $stmt = $db->query("INSERT INTO history (id_module, temp, speed, passengers) VALUES ($randomModuleId, NULL, NULL, NULL)");
        }

        $db->commit();

        if (!$stmt) {
            // get error -> print_r($db->errorInfo()); 
            $data['error'] = "Une erreur est survenue.";
        } elseif ($randomState == 1) {
            $data['success_1'] = "Le module $randomModuleId est réparé.";
        } else {
            $data['success_2'] = "Le module $randomModuleId est en panne.";
        }
    } else {
        $data['error-empty'] = "Aucun module existant en marche.";
    }
} else {
    $data['error'] = "Une erreur est survenue.";
}

echo json_encode($data);
