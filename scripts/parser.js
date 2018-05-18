var departement = new Object();
var totalVote = new Object();
var villes = new Object();	
var resultsDep = new Object();	
var resultsReg = new Object();
var dep = ["075" , "091" , "092" , "093" , "094" , "095" , "077", "078"];
var depDisplay = ["091" , "092" , "093" , "094" , "095" , "077", "078"];
var infoCandidat = {
  "FILLON": {color: "#0d47a1", civilite: "Homme", parti: "Les Républicains"}, 
  "HAMON": {color: "#ef5350", civilite: "Homme", parti: "Parti Socialiste"}, 
  "DUPONT-AIGNAN": {color: "#311b92", civilite: "Homme", parti: "Debout la France"}, 
  "LE PEN": {color: "#1a237e", civilite: "Femme", parti: "Front National"},
  "MACRON": {color: "#5c6bc0", civilite: "Homme", parti: "En Marche!"},
  "ARTHAUD": {color: "#4caf50", civilite: "Femme", parti: "Lutte Ouvrière"},
  "POUTOU": {color: "#b71c1c", civilite: "Homme", parti: "Nouveau Parti Anticapitaliste"},
  "CHEMINADE": {color: "#795548", civilite: "Homme", parti: "Solidarité et Progrès"},
  "LASSALLE": {color: "#f4511e", civilite: "Homme", parti: "Résistons !"},
  "MÉLENCHON": {color: "#f9a825", civilite: "Homme", parti: "La France Insoumise"},
  "ASSELINEAU": {color: "#aeea00", civilite: "Homme", parti: "Union Populaire Républicaine"},
};
const data = [];

function getSalariesByGeo() {
	Papa.parse("data/salaire-net-horaire-moyen-selon-la-categorie-socioprofessionnelle-le-sexe-et-lag.csv", {
		download: true,
		header: true,
		step: function(row) {
			const index = parseInt(row.data[0]['CODGEO']);
			if (!isNaN(index)) {
				data['0'+index] = row.data[0]['SNHM14'];
				$('#table-content').append('<tr><th scope="row">' + index + '</th><td>' + row.data[0]['SNHM14'] + '</td></tr>')
			}
		},
		complete: function() {
			dep.forEach(function(elm) {
				getResultsElectionDep(elm);
			 });		
		}
	})
}

function getResultsElectionDep(codeDep){		
	$.ajax({
		type: "GET" ,
		url: "/data/xml/elections/" + codeDep + "com.xml" ,
		dataType: "xml" ,
		success: function(xml) {
			villes = new Object();
			totalVote = new Object();
			$(xml).find('Commune').each(function() {			
				getResultsElectionCity($(this), codeDep + $(this).find("CodSubCom").text());
			});
			departement[codeDep] = villes;
			calculateMoy(codeDep);
		}
	});
}	
	
function getResultsElectionCity(xml, cityCode){	
	var candidat = new Object();
	$(xml).find('Candidat').each(function() {
		var name = $(this).find('NomPsn').text();
		if (data[cityCode] !== undefined) {
			candidat[name] = {nom: name, vote: parseInt($(this).find('NbVoix').text()), salaire: parseInt(data[cityCode])};
			if(totalVote[name] === undefined)
				totalVote[name] = 0;
			totalVote[name] += parseInt($(this).find('NbVoix').text());
		}
	});				
	villes[cityCode] = candidat;
}
	
function calculateMoy(codeDep){
	var somme = new Object();
	var test = 0;
	for(var elm in departement[codeDep])
	{
		for(var obj in departement[codeDep][elm]){
			//Par departement
			if(somme[departement[codeDep][elm][obj]['nom']] == undefined)
				somme[departement[codeDep][elm][obj]['nom']] = 0;
			somme[departement[codeDep][elm][obj]['nom']] += departement[codeDep][elm][obj]['vote']*departement[codeDep][elm][obj]['salaire']/totalVote[departement[codeDep][elm][obj]['nom']]
			//Par region				
			if(resultsReg[departement[codeDep][elm][obj]['nom']] == undefined)
				resultsReg[departement[codeDep][elm][obj]['nom']] = 0;
			resultsReg[departement[codeDep][elm][obj]['nom']] += (departement[codeDep][elm][obj]['vote']*departement[codeDep][elm][obj]['salaire']/totalVote[departement[codeDep][elm][obj]['nom']])/dep.length;
		}
	}
	resultsDep[codeDep] = somme;
  google.charts.load('current', {packages: ['corechart', 'bar']});
  google.charts.setOnLoadCallback(drawBasic);
  sendXMLFile(getXML(resultsDep));
}

function sendXMLFile(xml) {
  $.post('export.php', {xml: xml}, function(event) {
    $('#export-button').text('Export');
    $('#export-button').removeAttr("disabled");
  });
}

function drawBasic() {
      let dataToDisplay = [];
  
      const codeDepDisplay = $('#code-dep-input').val();

      dataToDisplay.push(['Element', 'Votes', { role: 'style' }]);
      
      $.each(resultsDep[codeDepDisplay], function(index, value) {
        let color = infoCandidat[index].color;
        if (color === undefined) {
          color = '#e5e4e2';
        }
         dataToDisplay.push([index, value, color]);
      }); 
      
      var data = google.visualization.arrayToDataTable(dataToDisplay);
    

      var options = {
        title: 'Salaires des votants',
        hAxis: {
          title: 'Candidats',
          format: 'h:mm a',
          viewWindow: {
            min: [7, 30, 0],
            max: [17, 30, 0]
          }
        },
        vAxis: {
          title: 'Salaires'
        }
      };

      var chart = new google.visualization.ColumnChart(
      document.getElementById('chart_div'));  

      chart.draw(data, options);
  }

function getXML(data) {
  let xmlData = "";
  xmlData += '<?xml version="1.0" encoding="utf-8"?><Election xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xsi:noNamespaceSchemaLocation="election.xsd">';
  xmlData += "<Scrutin><Annee>2017</Annee><NumTour>1</NumTour><Type>Présidentielle</Type></Scrutin>";
  xmlData += "<Description>Desc du doc</Description>";
  xmlData += "<Sources><Source>url</Source></Sources>";
  xmlData += "<Region>Ile de France</Region>";
  xmlData += "<Departements>";
  $.each(resultsDep, function(index, value) {
    xmlData += "<Departement>";
    xmlData += "<CodeDep>" + index + "</CodeDep>";
    xmlData += "<Candidats>";
    $.each(resultsDep[index], function(index, value) {
      xmlData += "<Candidat>";
      xmlData += "<Nom>";
      xmlData += index;
      xmlData += "</Nom>";
      xmlData += "<Civilite>";
      xmlData += infoCandidat[index].civilite;
      xmlData += "</Civilite>";
      xmlData += "<Parti>";
      xmlData += infoCandidat[index].parti;
      xmlData += "</Parti>";
      xmlData += "<SalaireMoy>";
      xmlData += value;
      xmlData += "</SalaireMoy>";
      xmlData += "</Candidat>";
    });
    xmlData += "</Candidats>";
    xmlData += "</Departement>";
  });
  xmlData += "</Departements>";
  xmlData += "</Election>";
  return xmlData;
}

$(document).ready(function() {  
  $("#table-content").hide(); 
	getSalariesByGeo();  
  depDisplay.forEach((index) => {
    $('#code-dep-input').append('<option value="'+ index +'">'+ index +'</option>')
  })
});

