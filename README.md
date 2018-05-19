# vote-region
Le but de cette Application est de permettre la consultation des salaires moyen des votants en Ile de Franc pour chaque candidats présent à l'élection présidentielle 2017.

Nous récupérons différentes données :
-https://www.interieur.gouv.fr/avotreservice/elections/telechargements/PR2017/resultatsT1/011/ => les résultats des votes de différents départements de l'île de France, les fichier sont au format XML.

-https://www.data.gouv.fr/fr/datasets/salaire-net-horaire-moyen-selon-la-categorie-socioprofessionnelle-le-sexe-et-lage-en-2014/#_ => Le salaire moyen par communes en France au format CSV.

<strong>#Utilisation de l'application </strong></br>
Pour faire fonctionner l'application en local, il faut utiliser un serveur PHP.

La version de production est disponible au lien suivant :
[Prod](https://vote-region.herokuapp.com/)

<strong>#Schéma et fichier d'exemple XML </strong></br>
Un fichier d'exemple d'export XML est diponible, il se nomme "data.xml" le fichier de schéma XML ou plutot le fichier XSD se nomme "election.xsd".

<strong>#Explication technique</strong></br>
Le fichier "index.php" est le principal fichier de notre application, nous utilisons la librairie "PapaParse" pour parser les fichiers d'entrées au format CVS. Nous utilisons aussi la libririe javascript gstatic pour afficher nos données sous forme de graphiques. Nous nous aidons aussi avec du Jquery.

Notre fichier de script principal où nous traitons les données se nomme "parser.js".
