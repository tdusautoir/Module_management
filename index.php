<?php

require_once('./php/config.php');
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
    <link rel="stylesheet" href="./css/style.css">
    <title>Module_manager</title>
</head>

<body>
    <div class="content">
        <h1>Module Manager</h1>


        <div class="controller">
            <p>Rafraichissement : </p>
            <button class="btn btn-secondary" id="refreshbtn">Off</button>
        </div>

        <section class="module-manager">
            <form id="form" method="POST">
                <div>
                    <label for="name" class="form-label">Nom du module</label>
                    <input type="name" class="form-control mb-2" name="name">
                    <!-- border-danger -->
                    <button id="submit" type="submit" name="submit" class="btn btn-primary">Ajouter un module</button>
                </div>
            </form>
            <div class="module-container">
                <div class="module-list">
                </div>
            </div>
        </section>

        <section class="history">
            <h2>Historique</h2>
            <ul class="history-list">
            </ul>
        </section>

        <section class="chart">
            <h2>Graphique</h2>
            <canvas id="myChart" width="1000" height="800"></canvas>
        </section>

        <div class="my-modal" id="modal">
        </div>
    </div>
</body>
<script src="./js/script.js"></script>

</html>