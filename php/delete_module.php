<?php

header('Content-type: application/json');

require_once 'config.php';

$data = array();

if (isset($_GET['id']) && !empty($_GET['id'])) {

    $db->beginTransaction();

    $idModule = $_GET['id'];

    $stmt = $db->query("DELETE FROM module WHERE id = $idModule");
    $stmt = $db->query("DELETE FROM history WHERE id = $idModule");

    $db->commit();

    if (!$stmt) {
        // print_r($db->errorInfo());
        $data['error'] = "Une erreur est survenue.";
    } else {
        $data['success'] = "La suppression du module $idModule est un succés.";
    }
} else {
    $data['error'] = "Veuillez inscrire un id.";
}

echo json_encode($data);
