<?php

header('Content-type: application/json');

require_once 'config.php';

$data = array();

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    //inserrer des valeurs a l'historique des modules uniquement en marche
    $stmt = $db->query("INSERT INTO history (id_module, temp, speed, passengers) SELECT history.id_module, ROUND((RAND() * (70-50))+50), ROUND((RAND() * (110-90))+90), ROUND((RAND() * (200-50))+50) FROM history INNER JOIN (SELECT MAX(history.id) AS id FROM history INNER JOIN module ON history.id_module = module.id WHERE module.state = 1 GROUP BY id_module) maxid ON history.id = maxid.id");

    if (!$stmt) {
        // print_r($db->errorInfo());
        $data['error'] = "Une erreur est survenue.";
    } else {
        $data['success'] = "Les informations de l'historique ont été modifié.";
    }
} else {
    $data['error'] = "Une erreur est survenue.";
}

echo json_encode($data);
