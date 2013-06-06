// js/base_map.js

// Breakpoint.js
$(window).setBreakpoints({
  // use only largest available vs use all available
  distinct: true, 
  // array of widths in pixels where breakpoints
  // should be triggered
  breakpoints: [
    625
  ] 
});

// Basic map information
var map = new L.Map('map',{
	maxBounds: [[41.476046,-94.350586],[44.020209,-88.400391]]
});

// Our base tile information
// var map = L.basetile.map(div_location, 'csessig86.map-v13sln7r').setView([latitude, longitude], zoom);
var basetileUrl = "http://{s}.tile.cloudmade.com/f14689c8008d43da9028a70e6a8e710a/999/256/{z}/{x}/{y}.png";
basetileAttribution = 'Map data CCBYSA &copy; 2012 OpenStreetMap contributors, Imagery &copy; 2012 CloudMade';
basetile = new L.TileLayer(basetileUrl, {maxZoom: 18, attribution: basetileAttribution});
map.addLayer(basetile);


// Will be used later to toggle tornado paths
count = 0;

// Style the tornado path 1
var style = {
	color: "#FDD49E",
	weight: 2,
	opacity: 0.8,
	fillOpacity: 0.5,
	fillColor: "#FEE8C8"
}
// Style the tornado path 2
var style_dos = {
	color: "#EF6548",
	weight: 2,
	opacity: 0.8,
	fillOpacity: 0.5,
	fillColor: "#FC8D59"
}
// Style the tornado path 3
var style_tres = {
	color: "#B30000",
	weight: 2,
	opacity: 0.8,
	fillOpacity: 0.5,
	fillColor: "#7F0000"
}
// Style the second tornado
var style_cuatro = {
	color: "#EF6548",
	weight: 3,
	opacity: 0.8,
	fillOpacity: 0.5,
	fillColor: "#FC8D59"
}

// Our tornado paths
var geojson = L.geoJson(damage, {
	style: style
});
var geojson_dos = L.geoJson(damage_dos, {
	style: style_dos
});
var geojson_dos_dos = L.geoJson(damage_dos_dos, {
	style: style_dos
});
var geojson_dos_tres = L.geoJson(damage_dos_tres, {
	style: style_dos
});
var geojson_dos_cuatro = L.geoJson(damage_dos_cuatro, {
	style: style_dos
});
var geojson_dos_cinco = L.geoJson(damage_dos_cinco, {
	style: style_dos
});
var geojson_cuatro = L.geoJson(damage_cuatro, {
	style: style_cuatro
});
var geojson_tres = L.geoJson(damage_tres, {
	style: style_tres
});

function view_options() {
	// We'll remove the layers as long as this isn't the first time through this function
	if (count > 0) {
		map.removeLayer(geojson);
		map.removeLayer(geojson_dos);
		map.removeLayer(geojson_dos_dos);
		map.removeLayer(geojson_dos_tres);
		map.removeLayer(geojson_dos_cuatro);
		map.removeLayer(geojson_dos_cinco);
		map.removeLayer(geojson_tres);
		map.removeLayer(geojson_cuatro);
	}
	count = count + 1;

	if (document.getElementById('outer_box').checked === true) {
		map.addLayer(geojson);
	}
	if (document.getElementById('e2_box').checked === true) {
		map.addLayer(geojson_dos);
		map.addLayer(geojson_dos_dos);
		map.addLayer(geojson_dos_tres);
		map.addLayer(geojson_dos_cuatro);
		map.addLayer(geojson_dos_cinco);
		map.addLayer(geojson_cuatro);	
	}
	if (document.getElementById('e4_box').checked === true) {
		map.addLayer(geojson_tres);
	}
};

// Toggle for Damage Area legend
// Toggles view/hide of tornado tracks
isVisibleDamage = true;
$('#toggle_damage').click(function() {
	$('#hide_this_toggle_damage').slideToggle('slow');
	if(isVisibleDamage){
		$('#toggle_damage').html("Click to show");
		isVisibleDamage = false;
	} else {
		$('#toggle_damage').html("Click to hide");
		isVisibleDamage = true;
	}
});


// Toggle for Show description button
// Only visible on mobile
isVisibleDescription = false;
$('.toggle_description').click(function() {
	if (isVisibleDescription === false) {
		// console.log('false');
		$('.description_box_cover').show();
		$('.description_box').show();
		isVisibleDescription = true;
	} else {
		// console.log('true');
		$('.description_box_cover').hide();
		$('.description_box').hide();
		isVisibleDescription = false;
	}
});
$('.next_button').click(function() {
	isVisibleDescription = false;
});
$('.previous_button').click(function() {
	isVisibleDescription = false;
});


// Set the location of the tornado path geoJSON layer
// Based on the size of the browser
// This is a fall back if the functions below don't work
// console.log($(window).width());
if ($(window).width() < 626) {
	map.fitBounds(geojson.getBounds());
	$('.hide_this_toggle_damage').hide();
	$('#toggle_damage').html("Click to show");
	isVisibleDamage = false;
} else {
	map.setView([42.56, -92.25], 10);
	$('.hide_this_toggle_damage').show();
	$('#toggle_damage').html("Click to hide");
	isVisibleDamage = true;
	$('.description_box_cover').hide();
	$('.description_box').hide();
}


// Options for switching between mobile, desktop views
// Uses Breakpoint.js
$(window).bind('exitBreakpoint625',function() {
  $('#share').hide();
  // map.fitBounds(geojson.getBounds());
});

$(window).bind('enterBreakpoint625', function() {
  $('.description_box').hide();
  $('.description_box_cover').hide();
  $('.sidebar').show();
  // map.setView([42.56, -92.2], 10);
});