function getSalariesByGeo() {
  const data = []
  Papa.parse("data/salaire-net-horaire-moyen-selon-la-categorie-socioprofessionnelle-le-sexe-et-lag.csv", {
    download: true,
    step: function(row) {
      data[row.data[0][0]] = row.data[0][2];
    },
    complete: function() {
      console.log("Finish");
    }
  })
  return data;
}


$(document).ready(function() {  
  console.log(getSalariesByGeo())
});