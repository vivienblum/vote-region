var departement = new Object();
var totalVote = new Object();
var villes = new Object();	
var resultsDep = new Object();	
var resultsReg = new Object();
var dep = ["075" , "091" , "092" , "093" , "094" , "095" , "077", "078"];
var depDisplay = ["091" , "092" , "093" , "094" , "095" , "077", "078"];
var colorCandidat = {
  "FILLON": "#0d47a1", 
  "HAMON": "#ef5350", 
  "DUPONT-AIGNAN": "#311b92", 
  "LE PEN": "#1a237e",
  "MACRON": "#5c6bc0",
  "ARTHAUD": "#4caf50",
  "POUTOU": "#b71c1c",
  "CHEMINADE": "#795548",
  "LASSALLE": "#f4511e",
  "MÉLENCHON": "#f9a825",
  "ASSELINEAU": "#aeea00",
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
  //drawBasic();
  // TODO : construire l'XML et l'envoyer en param de cette fonction
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
        let color = colorCandidat[index];
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
  xmlData += "<statistiques>";
  $.each(resultsDep, function(index, value) {
    xmlData += "<departement codeDep='" + index + "'>";
    $.each(resultsDep[index], function(index, value) {
      xmlData += "<vote>";
      xmlData += "<candidat>";
      xmlData += index;
      xmlData += "</candidat>";
      xmlData += "<salaire_votants>";
      xmlData += value;
      xmlData += "</salaire_votants>";
      xmlData += "</vote>";
    });
    xmlData += "</departement>";
  });
  xmlData += "</statistiques>";
  return xmlData;
}

$(document).ready(function() {  
  $("#table-content").hide(); 
	getSalariesByGeo();  
  depDisplay.forEach((index) => {
    $('#code-dep-input').append('<option value="'+ index +'">'+ index +'</option>')
  })
});

