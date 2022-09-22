<?php

header('Content-type: application/json');

require_once 'config.php';

$data = array();


//requete afin de recuperer le dernier historique de tous les différents modules
$getHistory = $db->query("SELECT * FROM history INNER JOIN module ON history.id_module = module.id ORDER BY history.date DESC LIMIT 20;");

if ($getHistory->rowCount() > 0) {
    while ($history = $getHistory->fetch()) {
        $historyData = array(
            'id' => $history['id_module'],
            'name' => $history['name'],
            'starting_date' => $history['starting_date'],
            'state' => $history['state'],
            'temp' => $history['temp'],
            'speed' => $history['speed'],
            'passengers' => $history['passengers'],
            'date_history' => $history['date']
        );
        array_push($data, $historyData);
    }
} else {
    $data['error'] = "L'historique est vide.";
}
echo json_encode($data);
