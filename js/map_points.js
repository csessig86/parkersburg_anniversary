// js/map_points.js

// Variables
// Awesome marker stuff
var victimMarker = L.AwesomeMarkers.icon({
  icon: 'icon-warning-sign',
  color: 'cadetblue'
});

var videoMarker = L.AwesomeMarkers.icon({
  icon: 'icon-film',
  color: 'darkpurple'
});

var photoMarker = L.AwesomeMarkers.icon({
  icon: 'icon-camera',
  color: 'darkpurple'
});

var beforeafterMarker = L.AwesomeMarkers.icon({
  icon: 'icon-picture',
  color: 'darkblue'
});

// Variables with marker information
var photos_layer_group = new L.LayerGroup();
var videos_layer_group = new L.LayerGroup();
var before_after_layer_group = new L.LayerGroup();
var victims_layer_group = new L.LayerGroup();

// Counters for previous, next buttons
var prev_next_button_count = 0;
var show_markers_count = 0;
photo_count = 0;


// Functions
// Get the photo template in place
function start_up_photos(latitude, longitude) {
  // Determine which icon to use
  if (timeline[number].small === 'yes' || timeline[number].small === 'no_victim') {
    var layer = new L.marker([latitude,longitude], { icon: victimMarker });
  } else if (timeline[number].video === 'yes') {
    var layer = new L.marker([latitude,longitude], { icon: videoMarker });
  } else if (timeline[number].small === 'beforeafter') {
    var layer = new L.marker([latitude,longitude], { icon: beforeafterMarker });
  } else if (timeline[number].small !== 'yes') {
    var layer = new L.marker([latitude,longitude], { icon: photoMarker });
  }

  // Create the popup
  var popup_photo_header = '<h3>' + timeline[number].header + '</h3>';
  
  // If we have a small photo, we will float it to the left
  // Small photos go with victim boxes
  if (timeline[number].small === 'yes') {
    var popup_photo = '<p align="left">';
    popup_photo += '<img style="float: left; padding-right: 5px;" src="' + timeline[number].asset + '" />';
    popup_photo += '</p>';
    popup_photo += timeline[number].popinfo + '<br />';
    popup_photo += 'To read more, <a href="' + timeline[number].article + '" target="_blank">click here</a>.<br />';
    popup_photo += '<div class="caption_box">Caption: ' + timeline[number].photocaption + '</div>';
  // If we have a large photo, we will center it
  } else {
    if (timeline[number].small === 'beforeafter') {
      var popup_photo = '<div class="before-after-container">';
      if ($(window).width() > 949) {
        popup_photo += '<div><img alt="before" src="' + timeline[number].asset + '" style="width:900px; height:578px;" /></div>';
        popup_photo += '<div><img alt="after" src="' + timeline[number].afterphoto + '" style="width:900px; height:578px;" /></div>';
      } else {
        box_width = $(window).width() - 25;
        box_height = box_width * 0.64;
        if ($(window).width() < 626) {
          popup_photo += '<div><img alt="before" src="' + timeline[number].mobile + '" style="width:' + box_width + 'px; height:' + box_height + 'px;" /></div>';
          popup_photo += '<div><img alt="after" src="' + timeline[number].mobileafter + '" style="width:' + box_width + 'px; height:' + box_height + 'px;" /></div>';
        } else {
          popup_photo += '<div><img alt="before" src="' + timeline[number].asset + '" style="width:' + box_width + 'px; height:' + box_height + 'px;" /></div>';
          popup_photo += '<div><img alt="after" src="' + timeline[number].afterphoto + '" style="width:' + box_width + 'px; height:' + box_height + 'px;" /></div>';
        }
      }
      popup_photo += '</div>';
      popup_photo += '<script type="text/javascript">$(function(){$(".before-after-container").beforeAfter({animateIntro: true});});</script>';
    } else if (timeline[number].video === 'no') {
      var popup_photo = '<p align="center">';
      if ($(window).width() < 626 && timeline[number].small === 'no') {
        popup_photo += '<img src="' + timeline[number].mobile + '" />';
      } else {
        popup_photo += '<img src="' + timeline[number].asset + '" />';
      }
      popup_photo += '</p>';
    } else if (timeline[number].video === 'yes') {
      var popup_photo = '<div class="video-container">' + timeline[number].asset + '</div>';
    }
    popup_photo += '</p>';
    popup_photo += '<p>' + timeline[number].popinfo + '</p>';
    popup_photo += '<p>To read more, <a href="' + timeline[number].article + '" target="_blank">click here</a>.</p>';
    popup_photo += '<div class="caption_box">Caption: ' + timeline[number].photocaption + '</div>';
  };

  // Toggle for photos and X buttons
  // Only visible on mobile
  layer.on("click", function(e) {
    // console.log('photo click');
    $('.img_box_cover').show();
    $('.img_box_header').html(popup_photo_header);
    $('.img_box_content').html(popup_photo);
    $('.img_box').show();
    $('.toggle_img').show();
  });

  $('.toggle_img').on("click", function() {
    $('.img_box_cover').hide();
    $('.img_box').hide();
    $('.toggle_img').hide();
  });
  
  // Add to our layer groups
  if (timeline[number].small === 'yes' || timeline[number].small === 'no_victim') {
    victims_layer_group.addLayer(layer);
  } else if (timeline[number].small === 'beforeafter') {
    before_after_layer_group.addLayer(layer);
  } else if (timeline[number].video === 'yes') {
    videos_layer_group.addLayer(layer);
  } else {
    photos_layer_group.addLayer(layer);
  }
}

// This renders our content on the page
// We use fancy fade in effects because we're feeling fancy
function set_text(header, text) {
  $('.sidebar_header_text').hide();
  $('.sidebar_header_text').html('<h3>' + header + '</h3>');
  $('.sidebar_header_text').fadeIn(750);

  $('.sidebar_text').hide();
  $('.sidebar_text').html(text);
  $('.sidebar_text').fadeIn(750);

  $('.description_box_header').hide();
  $('.description_box_header').html('<h3>' + header + '</h3>');
  $('.description_box_header').fadeIn(750);
      
  $('.description_box_text').hide();
  $('.description_box_text').html(text);
  $('.description_box_text').fadeIn(750);
};

// This is ran every time the previous or next buttons are pressed
function set_map(e, prev_next) {
    show_markers_count += 1;

    // This enables the map to jump from point to point
    if (prev_next === 'next') {
      prev_next_button_count += 1;
    } else if (prev_next === 'prev') {
      prev_next_button_count -= 1;
    }

    // 0. Default zoom
    if (prev_next_button_count === 0) {
      // Change the text on button from "Reset" to "Next"
      $('.next_button').html('Next');

      // Remove markers to the map
      map.removeLayer(victims_layer_group);
      map.removeLayer(before_after_layer_group);
      map.removeLayer(videos_layer_group);
      map.removeLayer(photos_layer_group);

      // Hide marker view options
      $('#view_header').hide();
      $('.view').hide();

      // Hide previous button
      $('.previous_button').hide();

      // Hide share buttons if on mobile
      if ($(window).width() > 626) {
        $('#share').show();
      }

      // Display content
      set_text("Disaster in eastern Iowa", "<p>On May 25, 2008, a killer EF-5 tornado traveled 43 miles across the plains of eastern Iowa, crushing several towns in its path.</p><p>In all, the storm that hit Parkersburg, New Hartford, Dunkerton and surrounding towns killed nine people and destroyed 450 homes.</p><p>On the five year anniversary of one of Iowa's most dangerous tornadoes, the Courier takes a look back at the dramatic storm that pummeled through eastern Iowa.</p><p>Shown to the left is the tornado's path and the damage it did in eastern Iowa. Click 'Next' to follow the tornado's path and see what towns it hit.</p>");

      // Set view for mobile
      if ($(window).width() < 626) {
        map.fitBounds(geojson.getBounds());
      // Set view for desktop
      } else {
        map.setView([42.56, -92.25], 10);
      }

    // 1. Tornado forms
    } else if (prev_next_button_count === 1) {
      // Hides share buttons, show previous button
      $('#share').hide();
      $('.previous_button').show();

      // Display content
      set_text("1. Tornado forms", "<p><strong>4:48 p.m.</strong> - At 3:30 p.m., a tornado watch was issued for Butler and Black Hawk Counties. This was upgraded to a tornado warning at 4:22 p.m.</p><p>At 4:46 p.m., a tornado warning  was issued for northern Grundy and southeast Butler Counties with Parkersburg specifically mentioned.</p></p> Minutes laters, the deadly tornado touched down near the Butler and Grundy county line, two miles south of Aplington and five miles from Parkersburg, population 1,890.</p>");

      // Set view for mobile
      if ($(window).width() < 626) {
        map.setView([42.555, -92.87], 13);
        $('#legend').show();
        $('#hide_this_toggle_damage').hide();
      // Set view for desktop
      } else {
        map.setView([42.555, -92.86], 13);
      }

      // Add markers to the map
      window.setTimeout(
        function(){
          map.addLayer(victims_layer_group);
          map.addLayer(before_after_layer_group);
          map.addLayer(videos_layer_group);
          map.addLayer(photos_layer_group);
      }, 500);

      // Show marker options
      // Hide marker view options
      window.setTimeout(
        function(){
          $('#view_header').show();
          $('.view').show();
      }, 750);

    // 2. Tornado hits Parkersburg
    } else if (prev_next_button_count === 2) {
      // Make sure share button is hidden
      $('#share').hide();

      // Display content
      set_text("2. Tornado strikes Parkersburg", "<p><strong>4:56 p.m.</strong> - The twister quickly picked up stream, turning into an EF-5 tornado before striking Parkersburg. The tornado was near three-quarters of a mile wide with estimated wind speeds over 200 mph at its peak.</p><p>Of the towns in the storm's path, Parkersburg was hit the hardest. Estimates suggest a third or more of the buildings in Parkersburg were destroyed, including City Hall, the high school, two banks, a lumber yard and dozens of homes.</p><p>In less than four minutes, the south end of Parkersburg was flattened and 288 homes were destroyed.</p><p>Five people died immediately after the storm because of injuries they sustained, while another two people perished in the weeks and months following the tornado.</p>");
      
      // Set view for mobile
      if ($(window).width() < 626) {
        map.setView([42.575,-92.785], 13);
      // Set view for desktop
      } else {
        map.setView([42.572,-92.775], 15);
      }

    // 3. Storm moves into New Hartford
    } else if (prev_next_button_count === 3) {
      // Make sure share button is hidden
      $('#share').hide();

      set_text("3. Storm moves into New Hartford", "<p><strong>5:09 p.m.</strong> - The tornado maintained intensity as it moved into New Hartford. The twister was classified as a low-end EF-5 tornado in both Parkersburg and New Hartford.</p><p>After devastating Parkersburg, the storms followed Beaver Creek, hitting homes along 325th Street, Trapper Road and Beaver Valley Street.</p><p>All but two homes in the new Deer Trail addition took damage, and high winds toppled headstones and trees alike in the cemetery off of Utica Avenue.</p><p>Two New Hartford residents died as a result of the storm. Another four people were sent to the hospital and about 100 homes took damage ranging from broken roofs to total demolition.</p>");
      
      // Set view for mobile
      if ($(window).width() < 626) {
        map.setView([42.582,-92.64], 12);
      // Set view for desktop
      } else {
        map.setView([42.575,-92.61], 12);
      }

    // 4. Twister plows through Cedar Falls
    } else if (prev_next_button_count === 4) {
      // Make sure share button is hidden
      $('#share').hide();

      set_text("4. Twister plows into Cedar Falls", "<p><strong>5:22 p.m.</strong> - The tornado moves into northern Black Hawk County and continues east producing damage north of Cedar Falls.</p><p>A-1 Vacationland, located on Symons Road, is one of the worst hit areas in Cedar Falls. Just across U.S. Highway 218 to the west, the storm knocked down scores of trees and wiped out some powerlines.</p><p>In the Joanne Street neighborhood, just west from the intersection of Dunkerton and Big Woods roads, the storm caused extensive damage to trees, but spared all but one home. That home had roof damage.</p><p>A total of 50 homes were destroyed in Black Hawk County.</p>");
      
      // Set view for mobile
      if ($(window).width() < 626) {
        map.setView([42.582,-92.4], 12);
      // Set view for desktop
      } else {
        map.setView([42.575,-92.35], 12);
      }

    // 5. Tornado surges through Waterloo
    } else if (prev_next_button_count === 5) {
      // Make sure share button is hidden
      $('#share').hide();

      set_text("5. Tornado surges through Waterloo", "<p><strong>5:35 p.m.</strong> - The tornado continues east across rural Iowa, avoiding downtown Cedar Falls and Waterloo.</p><p>Several buildings on West Dunkerton and East Dunkerton roads, however, are in direct line of the tornado. Residents on this road, which is located in both Waterloo and Dunkerton, report heavy damage.</p><p>A total of 50 homes were destroyed in Black Hawk County as a result of the tornado.</p>");
      
      // Set view for mobile
      if ($(window).width() < 626) {
        map.setView([42.577,-92.34], 12);
      // Set view for desktop
      } else {
        map.setView([42.573,-92.3], 14);
      }

    // 6. Tornado intensifies in Dunkerton
    } else if (prev_next_button_count === 6) {
      // Make sure share button is hidden
      $('#share').hide();

      set_text("6. Tornado intensifies in Dunkerton", "<p><strong>5:50 p.m.</strong> - After weakening as it crossed Black Hawk County, the tornado re-intensifies and grows to nearly 1.2 miles wide north of Dunkerton.</p><p>The storm tore large pines from the ground and reduced houses to a pile of lumber. Power lines and downed trees draped over Canfield Road and C-57. Other roads, like Mount Vernon and Dunkerton roads, were impassible in spots because of debris or downed lines.</p><p>For many residents, the tornado present an eery sense of Déjà vu. A tornado rolled through the same area in 2000, destroying homes and farmlands.</p><p>Some of the same residents who were hit in 2000 were hit again in 2008. And some homes that avoided the 2000 tornado were destroyed during the 2008 tornado.</p>");
      
      // Set view for mobile
      if ($(window).width() < 626) {
        map.setView([42.605,-92.19], 11);
      // Set view for desktop
      } else {
        map.setView([42.585,-92.13], 12);
      }

    // 7. Tornado dissipates
    } else if (prev_next_button_count === 7) {
      // Make sure share button is hidden
      $('#share').hide();

      set_text("7. Tornado dissipates", "<p><strong>5:58 p.m.</strong> - An hour after it formed, the deadly tornado dissipates in northeast Black Hawk County just before 6 p.m.</p><p>At its worst, the tornado reached wind speeds of 205 mph, ranking it as an EF-5 tornado. It was the first EF-5 twister to strike Iowa since June 13, 1976.</p><p>In all, the twister travelled 43 miles, killing nine people, injuring at least 50 residents, destroying 450 homes and causing $90 million of damage in the process.</p>");
      
      // Set view for mobile
      if ($(window).width() < 626) {
        map.setView([42.63,-92.09], 12);
      // Set view for desktop
      } else {
        map.setView([42.62,-92.07], 13);
      }

      // 8. Second tornado forms
      } else if (prev_next_button_count === 8) {
        // Make sure share button is hidden
        $('#share').hide();

        set_text("8. Second tornado forms", "<p><strong>6:15 p.m.</strong> - Fifteen minutes after the first tornado dissipated, a second tornado forms southeast of Fairbank.</p><p>The second twister ranks as an EF-3 tornado with a width of almost three-fourths of a mile and wind speeds topping out at 160 p.m.</p><p>Because the second tornado happened so close to the first, many believe damage done to Hazleton and surrounding towns is a result of the first tornado. Records from the National Weather Service, however, show a second tornado actually formed and barreled through eastern Iowa.</p>");
      
        // Set view for mobile
        if ($(window).width() < 626) {
          map.setView([42.63,-91.7], 9);
        // Set view for desktop
        } else {
          map.setView([42.6,-91.5], 10);
        }

      // 9. Second tornado dissipates
      } else if (prev_next_button_count === 9) {
        // Make sure share button is hidden
        $('#share').hide();

        set_text("9. Second tornado dissipates", "<p><strong>7:10 p.m.</strong> - The second tornado, which covered about 32 miles of mostly rural Iowa, disspates.</p><p>Numerous outbuildings were destroyed, trees and power poles were knocked down, many homes sustained roof damage and non-anchored mobile homes in Hazleton were demolished by the tornado.</p><p>In all, three people were injured and three homes were destroyed.</p");
      
        // Set view for mobile
        if ($(window).width() < 626) {
          map.setView([42.57,-91.392], 13);
        // Set view for desktop
        } else {
          map.setView([42.565,-91.385], 15);
        }
		    
        // Change the text on button from "Reset" to "Next"
      	$('.next_button').html('Next');
		
      // 10. Second tornado dissipates
      } else if (prev_next_button_count === 10) {
        // Make sure share button is hidden
        $('#share').hide();

        set_text("10. Debris found in Wisconsin", "<p>Carried by strong winds, debris from Parkersburg such as photographs, personal papers and check stubs land in Prairie Du Chien, Wisconsin, which is located roughly 100 miles from Parkersburg.</p>One police sergeant picked up greeting cards and business records in his yard from a Walgreen's pharmacy.</p><p>Another item recovered was a small black-and-white photo of a woman, apparently taken in July 1957. The name Ethel Mulder was written on the back.</p><p>Mulder, 80, and her husband, Richard, were killed when the tornado hit their Parkersburg home.</p>");
      
        // Set view for mobile
        if ($(window).width() < 626) {
          map.setView([43.051651,-91.14124], 13);
        // Set view for desktop
        } else {
          map.setView([43.051651,-90.7], 9);
        }

        // Change the text on button from "Next" to "Reset"
        $('.next_button').html('Reset');

		  // 0. Disaster in eastern Iowa
      } else if (prev_next_button_count === 11) {
		    // Change the text on button from "Reset" to "Next"
      	$('.next_button').html('Next');

        // Remove markers to the map
        map.removeLayer(victims_layer_group);
        map.removeLayer(before_after_layer_group);
        map.removeLayer(videos_layer_group);
        map.removeLayer(photos_layer_group);

        // Hide marker view options
        $('#view_header').hide();
        $('.view').hide();

        // Hide previous button
        $('.previous_button').hide();

        // Hide share buttons if on mobile
        if ($(window).width() > 626) {
          $('#share').show();
        }

        // Display content
        set_text("Disaster in eastern Iowa", "<p>On May 25, 2008, a killer EF-5 tornado traveled 43 miles across the plains of eastern Iowa, crushing several towns in its path.</p><p>In all, the storm that hit Parkersburg, New Hartford, Dunkerton and surrounding towns killed nine people and destroyed 450 homes.</p><p>On the five year anniversary of one of Iowa's most dangerous tornadoes, the Courier takes a look back at the dramatic storm that pummeled through eastern Iowa.</p><p>Shown to the left is the tornado's path and the damage it did in eastern Iowa. Click 'Next' to follow the tornado's path and see what towns it hit.</p>");

        // Set view for mobile
        if ($(window).width() < 626) {
          map.fitBounds(geojson.getBounds());
        // Set view for desktop
        } else {
          map.setView([42.56, -92.25], 10);
        }

        // Reset the button count
        prev_next_button_count = 0;
	  }
};

// These click functions will toggle between map zooms
// First the next button
$(document).on({
  click: function (e) {
    set_map(e, 'next');
    $('.description_box').hide();
    $('.description_box_cover').hide();
  }
}, '.next_button');

// Here's the previous button
$(document).on({
  click: function (e) {
    set_map(e, 'prev');
    $('.description_box').hide();
    $('.description_box_cover').hide();
  }
}, '.previous_button');


// Function for our view options in the legend
function photo_view_options() {
  // We'll remove the layers first
  map.removeLayer(photos_layer_group);
  map.removeLayer(victims_layer_group);
  map.removeLayer(before_after_layer_group);
  map.removeLayer(videos_layer_group);

  if (document.getElementById('victims_box').checked === true) {
    map.addLayer(victims_layer_group);
  }
  if (document.getElementById('video_box').checked === true) {
    map.addLayer(videos_layer_group);
  }
  if (document.getElementById('before_after_box').checked === true) {
    map.addLayer(before_after_layer_group);
  }
  if (document.getElementById('photo_box').checked === true) {
    map.addLayer(photos_layer_group);
  }
};


// Load up the timeline.js file with all our photo information
for (number in timeline) {
    // Set lat, long
    latitude = timeline[number].latitude;
    longitude = timeline[number].longitude;

    // Send to start_up_photos function
    start_up_photos(latitude, longitude)
};


// Here's the information we load when our document is ready
$(document).ready(function() {
  set_text("Disaster in eastern Iowa", "<p>On May 25, 2008, a killer EF-5 tornado traveled 43 miles across the plains of eastern Iowa, crushing several towns in its path.</p><p>In all, the storm that hit Parkersburg, New Hartford, Dunkerton and surrounding towns killed nine people and destroyed 450 homes.</p><p>On the five year anniversary of one of Iowa's most dangerous tornadoes, the Courier takes a look back at the dramatic storm that pummeled through eastern Iowa.</p><p>Shown to the left is the tornado's path and the damage it did in eastern Iowa. Click 'Next' to follow the tornado's path and see what towns it hit.</p>");
});