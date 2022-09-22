<?php

header('Content-type: application/json');

require_once 'config.php';

$data = array();


//requete afin de recuperer le dernier historique de tous les différents modules
$getModule = $db->query("SELECT * FROM history INNER JOIN (SELECT MAX(history.id) AS id, module.name, module.state, module.starting_date FROM history INNER JOIN module ON history.id_module = module.id GROUP BY id_module) maxid ON history.id = maxid.id");

if ($getModule->rowCount() > 0) {
    while ($module = $getModule->fetch()) {
        $moduleData = array(
            'id' => $module['id_module'],
            'name' => $module['name'],
            'starting_date' => $module['starting_date'],
            'state' => $module['state'],
            'temp' => $module['temp'],
            'speed' => $module['speed'],
            'passengers' => $module['passengers'],
            'date_history' => $module['date']
        );
        array_push($data, $moduleData);
    }
} else {
    $data['error'] = "Aucun module n'a encore été crée";
}
echo json_encode($data);
