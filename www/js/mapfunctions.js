/**
 *	OIBS - Open Innovation Banking System
 *	Javascript-functionality for the map page
 *
 *	 This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License 
 * 	as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
 * 	
 * 	This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied  
 * 	warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for  
 * 	more details.
 * 	
 * 	You should have received a copy of the GNU General Public License along with this program; if not, write to the Free 
 * 	Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 *	
 *	 License text found in /license/ and on the website.
 *	
 *	authors:	Mikko Aatola <mikko@aatola.net>
 *	Licence:	GPL v2.0
 */	


function getMapStuff(url, searchob, fix_zoom)
{
    $.ajax({
        url: url,
        success: function(result){
            //$('#debugdiv').html(result);
            var mapstuff = JSON.parse(result);

            var i;
            if (mapstuff.locations) {
                var items;
                var item;

                for (var x in mapstuff.locations) {
                    items = mapstuff.locations[x];
                    item = items[0];
                    var ob = new Object();

                    for (i = 0; i < items.length; i++) {
                        var resultItem = new Object();

                        resultItem.type = items[i].type;
                        resultItem.location = x;
                        resultItem.url = items[i].url;

                        if (resultItem.type == 'user') {
                            resultItem.title = items[i].loginname;
                            resultItem.imgurl = items[i].imgurl;
                        } else
                        if (resultItem.type == 'content') {
                            resultItem.title = items[i].title_cnt;
                            resultItem.cty = items[i].key_cty;
                        } else
                        if (resultItem.type == 'group') resultItem.title = items[i].groupname; else
                        if (resultItem.type == 'campaign') resultItem.title = items[i].campaignname;

                        searchob.results.push(resultItem);
                    }

                    // Position
                    ob.position = new google.maps.LatLng(
                        item.latitude_crd,
                        item.longitude_crd
                    );
                    bounds.extend(ob.position)

                    var infoWinText = '';
                    if (items.length > 1) {
                        // More than 1 in the exact same location. Combine.
                        item.multiContent = true;
                        var stuff = new Object();
                        stuff['user'] = 0;
                        stuff['content'] = 0;
                        stuff['group'] = 0;
                        stuff['campaign'] = 0;
                        for (i = 0; i < items.length; i++) {
                            stuff[items[i].type]++;
                        }

                        if (stuff['user'] > 0)
                            infoWinText = 'Users: ' + stuff['user'];
                        if (stuff['content'] > 0) {
                            if (infoWinText != '')
                                infoWinText += "<br />\n";
                            infoWinText += 'Contents: ' + stuff['content'];
                        }
                        if (stuff['group'] > 0) {
                            if (infoWinText != '')
                                infoWinText += "<br />\n";
                            infoWinText += 'Groups: ' + stuff['group'];
                        }
                        if (stuff['campaign'] > 0) {
                            if (infoWinText != '')
                                infoWinText += "<br />\n";
                            infoWinText += 'Campaigns: ' + stuff['campaign'];
                        }
                    } else {
                        // Only 1 in this location.
                        item.multiContent = false;
                    }

                    // Marker
                    var markerTitle = '';
                    if (item.multiContent) {
                        markerTitle = 'Multiple items';
                    } else {
                        if (item.type == 'user') markerTitle = item.loginname; else
                        if (item.type == 'content') markerTitle = item.title_cnt; else
                        if (item.type == 'group') markerTitle = item.groupname; else
                        if (item.type == 'campaign') markerTitle = item.campaignname;
                    }
                    ob.marker = new google.maps.Marker({
                        position: ob.position,
                        map: map,
                        title: markerTitle
                    });

                    var infoDesc = '';
                    var markerIcon = baseurl + "/images/map_dot_red.png";
                    var markerShadow = baseurl + "/images/map_dot_shadow.png";
                    if (item.multiContent) {
                        markerIcon = baseurl + "/images/map_landmarks.png";
                        markerShadow = baseurl + "/images/map_landmarks_shadow.png";
                    } else {
                        if (item.type == 'user') {
                            if (item.current_user) {
                                markerIcon = baseurl + "/images/map_man.png";
                                markerShadow = baseurl + "/images/map_man_shadow.png";
                            } else {
                                markerIcon = baseurl + "/images/map_dot_lblue.png";
                            }
                        } else
                        if (item.type == 'content') {
                            if (item.key_cty == "idea") {
                                markerIcon = baseurl + "/images/map_dot_green.png";
                                infoDesc = "Idea: ";
                            } else if (item.key_cty == "finfo") {
                                markerIcon = baseurl + "/images/map_dot_yellow.png";
                                infoDesc = "Vision: ";
                            } else if (item.key_cty == "problem") {
                                markerIcon = baseurl + "/images/map_dot_red.png";
                                infoDesc = "Challenge: ";
                            }
                        } else
                        if (item.type == 'group') markerIcon = baseurl + "/images/map_dot_purple.png"; else
                        if (item.type == 'campaign') markerIcon = baseurl + "/images/map_dot_purple.png";
                    }
                    ob.marker.setIcon(markerIcon);
                    ob.marker.setShadow(new google.maps.MarkerImage(
                        markerShadow,
                        new google.maps.Size(59, 32),
                        new google.maps.Point(0, 0),
                        new google.maps.Point(16, 32)
                    ));

                    // Info window
                    if (!item.multiContent) {
                        infoWinText = '<a href="' + item.url +'">' + markerTitle + '</a>';
                        if (item.type == 'user') {
                            infoWinText += '<br />'
                                + '<img src="' + item.imgurl
                                + '" alt="User Image" class="avatar" width="50" />';
                        } else
                        if (item.type == 'content') {
                            infoWinText = infoDesc + infoWinText
                                + ' by ' + item.login_name_usr;
                        }
                    }
                    ob.infoWin = new google.maps.InfoWindow({ content: infoWinText });

                    // Done
                    searchob.groupedresults.push(ob);
                }
            }

            // Click-listeners
            for (i = 0; i < searchob.groupedresults.length; i++) {
                google.maps.event.addListener(
                    searchob.groupedresults[i].marker,
                    'click',
                    (function(markerArg, index) {
                        return function() {
                            searchob.groupedresults[index].infoWin.open(map, markerArg);
                        };
                    }) (searchob.groupedresults[i].marker, i)
                );
            }

            map.fitBounds(bounds);
            map.setCenter(bounds.getCenter());
            if (fix_zoom)
                map.setZoom(map.getZoom() + 1);

            document.getElementById('search_loader').style.display = "none";

            printSearchResults(searchob.results);
        }
    });
}

function printSearchResults(results)
{
    var content, users, groups, campaigns;
    content = users = groups = campaigns = "";
    for (var i = 0; i < results.length; i++) {
        if (results[i].type == "content")
            content += "<p>" + results[i].cty
                + ": <a href=\"" + results[i].url + "\">"
                + results[i].title
                + "</a> @ " + results[i].location + "</p>\n";
        else
        if (results[i].type == "user")
            users += "<p>" + results[i].type
                + ": <a href=\"" + results[i].url + "\">"
                + results[i].title
                + "</a> @ " + results[i].location + "</p>\n";
        else
        if (results[i].type == "group")
            groups += "<p>" + results[i].type
                + ": <a href=\"" + results[i].url + "\">"
                + results[i].title
                + "</a> @ " + results[i].location + "</p>\n";
        else
        if (results[i].type == "campaign")
            campaigns += "<p>" + results[i].type
                + ": <a href=\"" + results[i].url + "\">"
                + results[i].title
                + "</a> @ " + results[i].location + "</p>\n";
    }

    $('#search_results_content').html(content);
    $('#search_results_users').html(users);
    $('#search_results_groups').html(groups);
    $('#search_results_campaigns').html(campaigns);
}

function search()
{
    document.getElementById('search_loader').style.display = "inline";

    clearMapSearches();

    var dist = parseInt($('#search_distance').val().toString(), 10); if (isNaN(dist)) dist = 0;
    var loca = $('#search_location').val().toString();
    
    var usrs = $('#search_users').attr('checked').toString() == 'true' ? 1 : 0;
    var cnts = $('#search_contents').attr('checked').toString() == 'true' ? 1 : 0;
    var grps = $('#search_groups').attr('checked').toString() == 'true' ? 1 : 0;
    var cmps = $('#search_campaigns').attr('checked').toString() == 'true' ? 1 : 0;

    if (dist == 0) {
        var url_getmapstuff_final = url_getmapstuff;
        if (usrs == true) url_getmapstuff_final += '/users/1';
        if (cnts == true) url_getmapstuff_final += '/contents/1';
        if (grps == true) url_getmapstuff_final += '/groups/1';
        if (cmps == true) url_getmapstuff_final += '/campaigns/1';

        var o = new Object();
        o.groupedresults = [];
        o.results = [];

        getMapStuff(url_getmapstuff_final, o, false);
        searches.push(o);
    } else {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': loca}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var gloca = results[0].geometry.location;
                var lat = gloca.lat();
                var lng = gloca.lng();
                map.setCenter(gloca);

                var lox45 = dist / Math.sin(45);
                var ne = getDestination(lat, lng, 45, lox45);
                var sw = getDestination(lat, lng, 225, lox45);

                var o = new Object();
                o.groupedresults = [];
                o.results = [];

                o.rect = new google.maps.Rectangle({
                    map: map,
                    bounds: new google.maps.LatLngBounds(sw, ne),
                    clickable: false,
                    fillColor: "#4B9B07",
                    fillOpacity: 0.05,
                    strokeColor: "#4B9B07",
                    strokeOpacity: 0
                });

                bounds = new google.maps.LatLngBounds(sw, ne);

                var url_getmapstuff_final = url_getmapstuff
                    + '/distance/' + dist
                    + '/n/' + ne.lat()
                    + '/s/' + sw.lat()
                    + '/e/' + ne.lng()
                    + '/w/' + sw.lng();
                if (usrs == true) url_getmapstuff_final += '/users/1';
                if (cnts == true) url_getmapstuff_final += '/contents/1';
                if (grps == true) url_getmapstuff_final += '/groups/1';
                if (cmps == true) url_getmapstuff_final += '/campaigns/1';

                getMapStuff(url_getmapstuff_final, o, true);
                searches.push(o);
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }
}

function clearMapSearches()
{
    if (searches.length > 0) {
        for (var i = 0; i < searches.length; i++) {
            for (var j = 0; j < searches[i].groupedresults.length; j++) {
                searches[i].groupedresults[j].marker.setMap(null);
                searches[i].groupedresults[j].infoWin.close();
            }
            searches[i].groupedresults = [];
            searches[i].results = [];
            if (searches[i].rect) searches[i].rect.setMap(null);
            if (searches[i].center) searches[i].center.setMap(null);
        }
        searches = [];
    }
}

function toggleMapExtraFilters()
{
    if (document.getElementById('map_extra_filters').style.display == "none") {
        document.getElementById('map_extra_filters').style.display = "block";
        $('#map_show_extra_filters').html('Hide additional filters');
    } else {
        document.getElementById('map_extra_filters').style.display = "none";
        $('#map_show_extra_filters').html('Show additional filters...');
    }
}

/**
 * Returns the destination point from this point having travelled the given distance (in km) on the
 * given bearing along a rhumb line
 *
 * @param   lat      Starting point latitude
 * @param   lng      Starting point longitude
 * @param   {Number} brng: Bearing in degrees from North
 * @param   {Number} dist: Distance in km
 * @returns {google.maps.LatLng} Destination point
 */
function getDestination(lat, lng, brng, dist) {
    var R = 6371;
    var d = parseFloat(dist)/R;  // d = angular distance covered on earth's surface
    var lat1 = parseFloat(lat) * Math.PI / 180;
    var lon1 = parseFloat(lng) * Math.PI / 180;
    var bear = brng * Math.PI / 180;

    var lat2 = lat1 + d*Math.cos(bear);
    var dLat = lat2-lat1;
    var dPhi = Math.log(Math.tan(lat2/2+Math.PI/4)/Math.tan(lat1/2+Math.PI/4));
    var q = (!isNaN(dLat/dPhi)) ? dLat/dPhi : Math.cos(lat1);  // E-W line gives dPhi=0
    var dLon = d*Math.sin(bear)/q;
    // check for some daft bugger going past the pole
    if (Math.abs(lat2) > Math.PI/2) lat2 = lat2>0 ? Math.PI-lat2 : -(Math.PI-lat2);
    var lon2 = (lon1+dLon+3*Math.PI)%(2*Math.PI) - Math.PI;

    lat2 = lat2 * 180 / Math.PI;
    lon2 = lon2 * 180 / Math.PI;

    return new google.maps.LatLng(lat2.toString(), lon2.toString());
}