var blendingActive = true;
var lastEnvironmentLayer = null;
function toggleBlending() {
  blendingActive = !blendingActive;

  $('div', '#legend-blend-switch-button').stop();
  if (blendingActive) {
    $('div', '#legend-blend-switch-button').animate({ left: '25px' });
  } else {
    $('div', '#legend-blend-switch-button').animate({ left: '0px' });
  }

  drawData();
}

var order = [
  2,
  1,
  0
];

/* never called - replaced in SubcategoriesBox.vue */
/*
function addEnviro(environment)
{
    
//    if (lastEnvironmentLayer != null)
//        NPMap.config.L.removeLayer(lastEnvironmentLayer);

    blendingActive = true;
    temp = L.npmap.layer.mapbox({
        name: environment,
        opacity: blendingActive ? .5 : 1,
        id: 'mahmadza.GRSM_' + environment
    });
    lastEnvironmentLayer = temp.addTo(NPMap.config.L);
}
*/
function drawData() {
  for (var i = 0; i < order.length; i++) {
    var idx = order[i],
      color;
    switch (idx) {
      case 0:
        color = '_blue';
        break;
      case 1:
        color = '_pink';
        break;
      case 2:
        color = '_orange';
        break;
      default:
        return;
    }

    if (control._selectedSpecies[idx] !== undefined) {
      if (showPredicted && control._selectedSpecies[idx].visible) {
        try {
          NPMap.config.L.removeLayer(control._selectedSpecies[idx].predicted);
        } catch (e) { }
      }

      let specid = control._selectedSpecies[idx]._id;
      let geoJSON = undefined;
      console.log('Attempting to fetch species mbtiles... id is:', specid);
      $.ajax({
        url: `https://atlas-stg.geoplatform.gov/v4/atlas-user.${specid}${color}.json?access_token=pk.eyJ1IjoiYXRsYXMtdXNlciIsImEiOiJjazFmdGx2bjQwMDAwMG5wZmYwbmJwbmE2In0.lWXK2UexpXuyVitesLdwUg`,
        type : "get",
        async: false,
        success : function(response) {
          geoJSON = response;
        },
        error: function() {
          console.log(`Could not find tiles for ${specid}${color}`);
        }
      });
      console.log(geoJSON);
      if (!geoJSON) {
        console.warn(`Tiles for ${specid}${color} are not available.`);
        return;
      }
      control._selectedSpecies[idx].predicted = L.npmap.layer.mapbox({
        name: control._selectedSpecies[idx]._latin,
        opacity: blendingActive ? .5 : 1,
        tileJson: geoJSON,
      });

      if (showPredicted && control._selectedSpecies[idx].visible) {
        control._selectedSpecies[idx].predicted.addTo(NPMap.config.L);
      }
    }
  }
}

function reorderLayers() {
  $('#legend-species').children().each(function (idx) {
    var value;

    switch (this.id) {
      case 'legend-species-pink':
        value = 0;
        break;
      case 'legend-species-orange':
        value = 1;
        break;
      case 'legend-species-blue':
        value = 2;
        break;
      default:
        return;
    }

    order[$('#legend-species').children().length - idx - 1] = value;
  });

  recordAction('reordered layers', order[2] + ' ' + order[1] + ' ' + order[0]);
}