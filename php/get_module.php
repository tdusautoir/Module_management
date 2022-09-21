<?php

header('Content-type: application/json');

require_once 'config.php';

$data = array();

$getModule = $db->query("SELECT module.id, module.name, module.state, module.starting_date, history.temp, history.speed, history.passengers FROM module INNER JOIN history ON module.id = history.id_module ");

if ($getModule->rowCount() > 0) {
    while ($module = $getModule->fetch()) {
        $moduleData = array(
            'id' => $module['id'],
            'name' => $module['name'],
            'starting_date' => $module['starting_date'],
            'state' => $module['state'],
            'temp' => $module['temp'],
            'speed' => $module['speed'],
            'passagers' => $module['passengers'],
        );
        array_push($data, $moduleData);
    }
} else {
    $data['error'] = "Aucun module n'a encore été crée";
}
echo json_encode($data);
