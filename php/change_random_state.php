<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $db->beginTransaction();

    $getRandomId = $db->query("SELECT * FROM module WHERE state != 0 ORDER BY RAND() LIMIT 1;");
    $randomId = $getRandomId->fetch(PDO::FETCH_ASSOC); //recuperer un id aléatoire parmis les modules présents
    $randomModuleId = $randomId['id'];

    $randomState = rand(1, 2);

    //changer l'etat => en panne ou en marche d'un module aléatoire
    $stmt = $db->query("UPDATE module SET state = $randomState, starting_date = CURRENT_TIMESTAMP WHERE module.id = $randomModuleId AND module.state != $randomState");

    if ($randomState == 2) { //si le module devient en panne, retirer ses informations
        $stmt = $db->query("UPDATE history INNER JOIN module ON history.id_module = module.id SET temp = null, speed = null, passengers = null  WHERE module.id = $randomModuleId");
    }

    $db->commit();

    if (!$stmt) {
        print_r($db->errorInfo());
    } else {
        echo "success";
    }
} else {
    return;
}
