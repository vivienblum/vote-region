<?php
  $xml = $_POST['xml'];
  $file = 'data.xml';
  file_put_contents($file, $xml);
?>