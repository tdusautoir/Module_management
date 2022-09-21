<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $db->beginTransaction();

    $getRandomId = $db->query("SELECT * FROM module ORDER BY RAND() LIMIT 1;");
    $randomId = $getRandomId->fetch(PDO::FETCH_ASSOC); //recuperer un id aléatoire parmis les modules présents
    $randomModuleId = $randomId['id'];

    //changer l'etat => en panne d'un module aléatoire
    $stmt = $db->query("UPDATE module SET state = 2, starting_date = CURRENT_TIMESTAMP WHERE module.id = $randomModuleId");

    $db->commit();

    if (!$stmt) {
        print_r($db->errorInfo());
    } else {
        echo "success";
    }
} else {
    return;
}
