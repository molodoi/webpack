<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Webpack</title>

<?php
    $file = file_get_contents('http://localhost/demoWebpack/dist/manifest.json');
    $json = json_decode($file, true);
?>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="webpack.png">
  <link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/paper/bootstrap.min.css" rel="stylesheet" integrity="sha384-awusxf8AUojygHf2+joICySzB780jVvQaVCAt1clU3QsyAitLGul28Qxb2r1e5g+" crossorigin="anonymous">
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link href="dist/<?php echo $json["app.css"]; ?>">

</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <p>Teststststststs</p>
            </div>
        </div>
    </div>

  <script src="dist/<?php echo $json["app.js"]; ?>"></script>
</body>
</html>
