<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Vote Stats</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  </head>
  <body>
    <div class="jumbotron">
      <h1>Vote by region</h1>
      <div id="export-container">
      </div>
      <table class="table">
      <thead>
        <tr>
          <th scope="col">Code Geo</th>
          <th scope="col">Salaire Moyen</th>
        </tr>
      </thead>
      <tbody id="table-content">
      </tbody>
    </table>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="scripts/PapaParse-4.4.0/papaparse.js"></script>
    <script src="scripts/parser.js"></script>
    
  </body>
</html>