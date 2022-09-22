<?php

header('Content-type: application/json');

require_once 'config.php';

$data = array();

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    if (isset($_POST['name'])) {

        $db->beginTransaction();

        $module_name = $_POST['name'];

        $stmt = $db->query("INSERT INTO module (name) VALUES ('$module_name');");
        $stmt = $db->query("INSERT INTO history (id_module) VALUES (LAST_INSERT_ID());");

        $db->commit();

        if (!$stmt) {
            // print_r($db->errorInfo());
            $data['error'] = "Une erreur est survenue.";
        } else {
            $data['success'] = "L'ajout du module $module_name est un succés.";
        }
    }
} else {
    $data['error'] = "Une erreur est survenue.";
}

echo json_encode($data);
