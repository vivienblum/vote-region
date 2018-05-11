function getSalariesByGeo() {
  const data = []
  Papa.parse("data/salaire-net-horaire-moyen-selon-la-categorie-socioprofessionnelle-le-sexe-et-lag.csv", {
    download: true,
    header: true,
    step: function(row) {
      const index = parseInt(row.data[0][`CODGEO`]);
      if (!isNaN(index)) {
        data[index] = row.data[0][`SNHM14`];
      }
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