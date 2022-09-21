<?php

require_once 'config.php';

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
            $stmt = $db->query("UPDATE history INNER JOIN module ON history.id_module = module.id SET temp = null, speed = null, passengers = null  WHERE module.id = $moduleId");
        } else { //eteint ou en panne donc --> en marche
            $stmt = $db->query("UPDATE module SET state = 1, starting_date = CURRENT_TIMESTAMP() WHERE module.id = $moduleId");
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
} else {
    return;
}
