<?php

header('Content-type: application/json');

require_once 'config.php';

$data = array();

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    if (isset($_GET['id'])) {
        $db->beginTransaction();

        $moduleId = $_GET['id'];

        //recuperer l'etat du module
        $getStateFromId = $db->query("SELECT state FROM module WHERE module.id = $moduleId");
        $currentModule = $getStateFromId->fetch(PDO::FETCH_ASSOC);

        $currentState = $currentModule['state'];

        //changer l'etat selon son ancien etat
        if ($currentState == 1) { //en marche donc --> éteint
            $stmt = $db->query("UPDATE module SET state = 0 WHERE module.id = $moduleId");
            //enlever ses informations
            $stmt = $db->query("INSERT INTO history (id_module, temp, speed, passengers) VALUES ($moduleId, NULL, NULL, NULL)");
        } else { //eteint ou en panne donc --> en marche
            $stmt = $db->query("UPDATE module SET state = 1, starting_date = CURRENT_TIMESTAMP() WHERE module.id = $moduleId");
        }

        $db->commit();

        if (!$stmt) {
            // get info error -> print_r($db->errorInfo());
            $data['error'] = "Une erreur est survenue.";
        } else {
            $data['success'] = "L'etat a bien été modifié.";
        }
    } else {
        $data['error'] = "Une erreur est survenue.";
    }
} else {
    $data['error'] = "Une erreur est survenue.";
}

echo json_encode($data);
