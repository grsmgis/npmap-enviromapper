$(document).ready(function () {
  setTimeout(hacks, 2000);
});

window.onload = function () {
  /* Move zoom and measure controls directly below search tool */
  attemptExecute(function () {
    var el = document.getElementsByClassName('leaflet-top leaflet-left')[0];
    var searchBar = document.getElementById('search-tool');

    if (el === undefined || searchBar === undefined) {
      return false;
    } else {
      el.style.top = window.getComputedStyle(searchBar).getPropertyValue('height');
      return true;
    }
  });

  /* Remove default base layer switcher */
  attemptExecute(function () {
    if (document.getElementsByClassName('npmap-control-switcher')[0] === undefined) {
      return false;
    }

    $(document.getElementsByClassName('npmap-control-switcher')[0]).remove();
    return true;
  });

  /* turn off overlays by default */
  attemptExecute(function () {
    if (NPMap === undefined || NPMap.config === undefined || NPMap.config.overlays === undefined || NPMap.config.L === undefined) {
      return false;
    }

    for (var i = 0; i < NPMap.config.overlays.length; i++) {
      var overlay = NPMap.config.overlays[i];

      if (overlay.name === 'Trails' || overlay.name === 'Visitor Centers' || overlay.name === 'Roads' || overlay.name === 'Shelters' || overlay.name === 'Campsites') {
        overlay.visible = false;
        NPMap.config.L.removeLayer(overlay.L);
      }
    }

    return true;
  });


  /* prepare print tool */
  attemptExecute(function () {
    if (!(NPMap && NPMap.config && NPMap.config.L && NPMap.config.L.printControl && NPMap.config.L.printControl.print)) {
      return false;
    }

    var printContainer = L.DomUtil.create('div', 'leaflet-bar leaflet-control npmap-control-print'),
      bg = $('.npmap-toolbar .right li button.print').css('background-image');

    $('.leaflet-top.leaflet-left').append($(printContainer));
    $(printContainer).append($('.npmap-toolbar .right li button'));
    $('.npmap-map-wrapper').css({ 'top': '0px' });
    $('.npmap-control-print button').css({
      'background-image': bg,
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'border-top': '1px solid #1a2423',
      'height': '26px'
    });

    return true;
  });

  /* set up drawing tooltips */
  attemptExecute(function () {
    if ($('button.marker').get(0) === undefined || $('button.polyline').get(0) === undefined || $('button.circle').get(0) === undefined) {
      return false;
    }

    $('button.marker').get(0).setAttribute('tooltip', 'Press here, then click on the map to place a marker');
    $('button.polyline').get(0).setAttribute('tooltip', 'Press here, then click on the map to draw a path');
    $('button.circle').get(0).setAttribute('tooltip', 'Press here, then click and drag on the map to draw a circle');

    return true;
  });

  /* prepare search tool */
  prepareSearchTool().done(function () {

    /* prepare tooltips */
    $tooltips._initialize(document.body);
  });

  /* prepare date conversion utility */
  setInterval(function () {
    var item = $('.layer > .content > .description').get(0);
    if (item !== undefined) {
      if (!processed) {
        if (endsWith(item.innerHTML, '<a target="_blank" href="https://www.nps.gov/grsm/learn/nature/research.htm">Contribute to this dataset</a>')) {
          var tokens = item.innerHTML.split(' ');
          if (tokens[5] !== undefined) {
            var newDate = new Date(parseInt(tokens[5]));
          }
          $(item).html(item.innerHTML.replace(tokens[5], newDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) + ','));
          processed = true;
        }
      }
    } else {
      processed = false;
    }
  }, 100);

  $('.dropdown-input', '#search-initial-dropdown').focus();
  attemptExecute(function () {
    if ($('.leaflet-control-attribution').get(0) === undefined)
      return false;

    $('.leaflet-control-attribution').get(0).innerHTML = '<a href="https://github.com/nationalparkservice/npmap-species/issues?q=is%3Aissue+is%3Aopen+-label%3A508+-label%3Adeployment+-label%3Aduplicate+-label%3Awontfix" target="_blank">Report an Issue</a> | ' + $('.leaflet-control-attribution').get(0).innerHTML;
    return true;
  });

  $("#dropdown-initial-input").focus();
  setImageHovers();
}

var processed = false;

function attemptExecute(fn) {
  if (!fn()) {
    setTimeout(fn, 50);
  }
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/* Converts latin name to thumbnail URL */
function getThumbnailURL(latin_name) {
  return 'species_images/thumbnails/' + latin_name.toLowerCase().replace(" ", "_") + '.jpg';
}

/* The setup that's needed for thumbnail image hovers */
function setImageHovers() {
  // add the image thumbnail tag
  var img = $('<img>').attr('id', 'species-hover-thumbnail')
    .appendTo('body');

  // if the image doesn't load, show a fallback image
  img.on('error', function () {
    $(this).attr('src', 'species_images/thumbnails/adiantum_pedatum.jpg');
  });

  $('ul.species-list').on('mouseenter', 'li', function (e) {
    $("#species-hover-thumbnail").css({ display: 'block' });
    var latin_name = whichName == 'latin' ? this.innerHTML : 'What';
    $('#species-hover-thumbnail').attr('src',
      getThumbnailURL(latin_name));
    $("#species-hover-thumbnail").stop().animate({
      top: $(this).offset().top + 'px',
      left: $(this).offset().left + $(this).parent().outerWidth() + 'px'
    }, 50);
  });

  $('.species-list').on('mouseout', function () {
    $("#species-hover-thumbnail").css({ display: 'none' });
  });

}

var tooltipsEnabled = true;
function toggleTooltips() {
  $tooltips._toggleTooltips();

  var tooltipsButton = document.getElementById('search-banner-help-tooltips').children[0].children[0];
  if (tooltipsEnabled) {
    recordAction('tooltips turned off');
    $('#search-banner-tooltips-button').children().stop();
    $('#search-banner-tooltips-button').children().animate({ left: '0px' });
  } else {
    recordAction('tooltips turned on');
    $('#search-banner-tooltips-button').children().stop();
    $('#search-banner-tooltips-button').children().animate({ left: '37.5px' });
  }

  tooltipsEnabled = !tooltipsEnabled;
}

function showHelp() {
  closeDropdowns();

  recordAction('showed help overlay');
  if (minimized) {
    toggleMinimized();

    setTimeout(function () {
      $('body').chardinJs('start');
    }, 200);
  } else {
    $('body').chardinJs('start');
  }
}

var minimized = false,
  currentBaseLayer = undefined;
function toggleMinimized() {
  var minButton = document.getElementById('search-banner-help-minimizer-button');
  if (!minimized) {
    recordAction('minimized toolbar');
    $('body').chardinJs('stop');
    minButton.innerHTML = 'Expand';
    $('#search-tool').css({ overflow: 'hidden' });
    $('#search-tool').stop();
    $('.leaflet-top.leaflet-left').stop();
    $('#search-tool').animate({ height: '0px' });
    $('.leaflet-top.leaflet-left').animate({ top: '40px' });
  } else {
    recordAction('expanded toolbar');
    minButton.innerHTML = 'Collapse';
    $('#search-tool').stop();
    $('.leaflet-top.leaflet-left').stop();
    $('#search-tool').animate({ height: '127px' }, function () {
      $('#search-tool').css({ overflow: 'visible' });
    });
    $('.leaflet-top.leaflet-left').animate({ top: '127px' });
  }

  minimized = !minimized;
}

var lastBaseIndex = 0;
function updateBaseLayer(idx) {
  if (idx !== lastBaseIndex) {
    /* remove last layer (taken from NPMap.js switcher.js) */
    NPMap.config.baseLayers[lastBaseIndex].visible = false;
    NPMap.config.L.removeLayer(NPMap.config.baseLayers[lastBaseIndex].L);

    /* add new layer (taken from NPMap.js switcher.js) */
    recordAction('changed base layer');
    var newLayer = NPMap.config.baseLayers[idx];
    if (newLayer.type === 'arcgisserver') {
      newLayer.L = L.npmap.layer[newLayer.type][newLayer.tiled === true ? 'tiled' : 'dynamic'](newLayer);
    } else {
      newLayer.L = L.npmap.layer[newLayer.type](newLayer);
    }
    newLayer.visible = true;
    currentBaseLayer = newLayer.L;
    NPMap.config.L.addLayer(newLayer.L);

    lastBaseIndex = idx;

    $('.leaflet-control-attribution').get(0).innerHTML = '<a href="https://github.com/nationalparkservice/npmap-species/issues?q=is%3Aissue+is%3Aopen+-label%3A508+-label%3Adeployment+-label%3Aduplicate+-label%3Awontfix" target="_blank">Report an Issue</a> | ' + $('.leaflet-control-attribution').get(0).innerHTML;
  }
}

function toggleOverlay(idx) {
  var overlay = NPMap.config.overlays[idx];
  if (overlay.visible == false) {
    recordAction('turned on overlay');
    overlay.visible = true;
    NPMap.config.L.addLayer(overlay.L);
  } else {
    recordAction('turned off overlay');
    overlay.visible = false;
    NPMap.config.L.removeLayer(overlay.L);
  }
}

var showPredicted = true;
function togglePredicted() {
  showPredicted = !showPredicted;

  if (showPredicted) {
    recordAction('turned on predicted data');
    drawData();
  } else {
    recordAction('turned off predicted data');
    for (var i = 0; i < control._selectedSpecies.length; i++) {
      if (control._selectedSpecies[i] !== undefined && control._selectedSpecies[i].visible) {
        NPMap.config.L.removeLayer(control._selectedSpecies[i].predicted);
      }
    }
  }
}

var showObserved = false;
function toggleObserved() {
  showObserved = !showObserved;

  if (showObserved) {
    recordAction('turned on observed data');
  } else {
    recordAction('turned off observed data');
  }

  for (var i = 0; i < control._selectedSpecies.length; i++) {
    if (control._selectedSpecies[i] !== undefined && control._selectedSpecies[i].visible) {
      if (showObserved) {
        control._selectedSpecies[i].observed.addTo(NPMap.config.L);
      } else if (i == 0) {
        NPMap.config.L.removeLayer(control._selectedSpecies[i].observed);
      }
    }
  }
}

var showOverlayList = false;
function toggleOverlayList() {
  showOverlayList = !showOverlayList;

  if (showOverlayList) {
    $('#options-overlays-dropdown').stop();
    $('#options-overlays-dropdown').animate({ 'height': '126px' });
    $('#options-overlays-dropdown-ul').css({ 'display': 'block' });
  } else {
    $('#options-overlays-dropdown').stop();
    $('#options-overlays-dropdown').animate({ 'height': '20px' });
    $('#options-overlays-dropdown-ul').css({ 'display': 'none' });
  }
}

var whichName = 'common';
function toggleName() {
  if (whichName === 'common') {
    recordAction('switched to latin names');
    $('#search-initial-switch-button').children().stop();
    $('#search-initial-switch-button').children().animate({ left: '0px' });
    whichName = 'latin';
  } else {
    recordAction('switched to common names');
    $('#search-initial-switch-button').children().stop();
    $('#search-initial-switch-button').children().animate({ left: '75px' });
    whichName = 'common';
  }

  populateResults();

  tmp = $('.dropdown-input', '#search-initial-dropdown').val();
  $('.dropdown-input', '#search-initial-dropdown').val($('#search-initial-altname').html());
  $('#search-initial-altname').html(tmp);

  var swapNeeded = $('#search-initial-dropdown').css('backgroundColor') === 'rgb(202, 24, 146)';
  if (swapNeeded) {
    populateDistributionLists();
  }

  swapNeeded = $('#compare-dist-one-name').css('backgroundColor') === 'rgb(242, 142, 67)';
  if (swapNeeded) {
    var el = document.getElementById('compare-dist-one-name'),
      tmp = el.innerHTML;

    el.innerHTML = el.title;
    el.title = tmp;
  }

  swapNeeded = $('#compare-dist-two-name').css('backgroundColor') === 'rgb(29, 144, 156)';
  if (swapNeeded) {
    var el = document.getElementById('compare-dist-two-name'),
      tmp = el.innerHTML;

    el.innerHTML = el.title;
    el.title = tmp;
  }
}

function recordAction(event, label) {
  console.log('sending:', event, '-', label);
  ga('send', 'event', 'Interaction', event, label);
}

free_circle = true;

/* Used by Header.vue to change from the Environment Mapper to the Species Mapper */
/* Can be used in the future to toggle between the two */
function appChange() {
  $("#search-tool").slideUp();
  setTimeout(function () {
    $(".species-mapper-iframe").show();
  }, 600);
}

/* quick hacks by Moa for the mockup versions */
function hacks() {
  $(".most, .least").on("click", function () {
    $(".most, .least").each(function () {
      $(this).toggleClass("most");
      $(this).toggleClass("least");
    });
  });

  $(".species-list li").on("click", function () {
    selectSecondSpecies(this);
  });

  $(".sortbtn").on("click", function () {
    $(this).parent().children(".sortbtn").each(function () {
      $(this).removeClass("active");
    });
    $(this).addClass("active");
  });

  var element_ids = ["#search-initial", "#search-compare", "#species-controls"];
  for (i in element_ids) {
    var element_id = element_ids[i];
    $(element_id).children().each(function () {
      $(this).attr("disabled", 1);
      $(this).css({ opacity: 0.4 });
    });
  }

  /* not used - the dropdowns were removed with the inclusion of Multiselect */
  /*
  $("#search-initial-dropdown-select.environments li").on("click", function(){
      $("#dropdown-initial-input").val($(this).text());
      toggleSearchList(0);

      // make the environment map name
      var environment = $(this).text();
      environment = environment.replace(/ /g, "").toLowerCase();
      addEnviro(environment);

      // Show environment info card's toggle button
      $(this).parent().parent().parent().children(".species-info-toggle").show();
      $(this).parent().parent().parent().children(".species-info-box").show();

      for (i in element_ids)
      {
          var element_id = element_ids[i];
          $(element_id).children().each(function(){ 
              $(this).removeAttr("disabled"); 
              $(this).css({opacity: 1.0}); 
          });
      }

      // Show environment information
      $(".environment-info").show();

      // color the species lists
      /*var counter = 1;
      var orange1 = "rgb(205, 206, 65)";
      var orange2 = "rgb(189, 33, 38)";
      var pink1 = "rgb(240, 104, 162)";
      var pink2 = "rgb(117, 40, 120)";
      $("#search-initial-controls .species-list li").each(function(){
          var color = d3.interpolate(orange1, orange2)(counter / 15 * 1.0);
          counter++;
          $(this).css("background-color", color); 
      });
      counter = 0;
      $("#search-compare-contents .species-list li").each(function(){
          var color = d3.interpolate(pink1, pink2)(counter / 15 * 1.0);
          counter++;
          $(this).css("background-color", color); 
      });
      *//*
});
*/
  $(".species-list").on("click", "li", function () {
    var parent = $(this).parent().parent().parent();
    parent.children(".species-info-box").show();
    parent.children(".progress-bar").show();
    $(this).parent().parent().children(".dropdown-button").click();

    if (parent.attr("id") == "search-initial-controls") {
      parent.children(".species-info-toggle").show();
    }
    toggleSearchList(1);
  });

  $(".leaflet-map-pane").on("click", function (e) {


    /*
    if ($("#search-initial-dropdown-select").val() != "Select an environmental layer")
    {
        $(".both").removeClass("both-env");  
        $(".both").addClass("first-env");  
        $("#species-info").toggle();
        $("#species-info").css({
            left: e.pageX + "px", 
            top: e.pageY + "px"
        });
        free_circle = !free_circle;
        if($("#search-compare-one-dropdown").val() == "Select another to compare (optional)")
        {
            $(".second-env").hide();     
            $(".both").removeClass("both-env");  
            $(".both").addClass("first-env");
        }
        else
        {
             
            $(".second-env").show();     
            $(".both").addClass("both-env");  
            $(".both").removeClass("first-env");

        }
    }
    else
    {
        
    }
    */
  });

  $(".leaflet-control-edit button").each(function () {
    $(this).addClass("hidden-buttons");
  });
  var edit_button = $("<button>")
    .addClass("fa fa-pencil edit-pencil hack-round")
    .prependTo(".leaflet-control-edit");

  edit_button.on("click", function () {
    $(".hidden-buttons").slideToggle();
    $(this).toggleClass("hack-round");
  });
  $(".hidden-buttons").slideToggle();

  $("#search-initial-dropdown-select").on("change", function () {
    document.getElementById("search-compare-one-dropdown").disabled = false;

    $("#search-initial-dropdown-select").addClass("orange");
    addEnviro1();
  });

  $("#mockupoverlay").hide();
  var fileName = "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
  var link = '<link rel="stylesheet" type="text/css" href="' + fileName + '">'
  $('head').append(link);

  /*
  $(document).on("mousemove", function(e){
      if (free_circle == false)
          return;
      if (e.pageX > 50 && e.pageY > 110)
      {
          $("#circle").css({
              left: e.pageX - 27 + "px", 
              top: e.pageY - 27 + "px"
          });
          $("#circle").show();
      }
      else 
          $("#circle").hide();
  });
  */

  /*
  $(".species-info-toggle").on("click", function(){
      var el = $(this).parent().children(".species-info-box");
      if (el.outerHeight() < 10)
      {
          $(this).parent().children(".species-info-box").animate({height: 250});
          $(this).children(".triangle").css({transform: "rotate(180deg)"});
      }
      else
      {
          $(this).parent().children(".species-info-box").animate({height: 0});
          $(this).children(".triangle").css({transform: "rotate(0deg)"});
      }
  });
  */
}
function disabled(e) {
  e.preventDefault();
  alert('This is a mockup version');
  return false;
}
