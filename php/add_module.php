<?php

require 'config.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    if (isset($_POST['name'])) {

        $db->beginTransaction();

        $module_name = $_POST['name'];

        $stmt = $db->query("INSERT INTO module (name) VALUES ('$module_name');");
        $stmt = $db->query("INSERT INTO history (id_module) VALUES (LAST_INSERT_ID());");

        $db->commit();

        if (!$stmt) {
            print_r($db->errorInfo());
        } else {
            echo "success";
        }
    }
} else {
    return;
}
