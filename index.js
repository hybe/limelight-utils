// Copyright (C) 2015  Sami Pippuri

// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.

// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
// more details.

// You should have received a copy of the GNU General Public License along
// with this program.  If not, see <http://www.gnu.org/licenses/>.

var needle = require('needle');
var limelight = require('limelight');
var config = {
	limelight : {}
}
// Setup the auth variables.
var organization = null;
var access_key = null;
var secret = null;
 
// set configuration at runtime
module.exports.config = function(conf) {
	config = conf;
	// Setup the auth variables.
	organization = config.limelight.organization || '<ORGANIZATION_ID>';
	access_key = config.limelight.accessKey || '<LIMELIGHT_ACCESS_KEY>';
	secret = config.limelight.secret || '<LIMELIGHT_SECRET_KEY>';
}

// list all channel groups
module.exports.listChannelGroups = function(cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/channelgroups/all.json';
    return _execute(url, cb);
}

// list channels in a channel group
module.exports.listChannels = function(groupId, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/channelgroups/' + groupId + '/channels.json';
    return _execute(url, cb);
}

// get properties of a channel
module.exports.listChannelProperties = function(channelId, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + '/channels/' + channelId + '/properties.json';
	return _execute(url, cb);
}

// list media in a channel
module.exports.listMedia = function(channelId, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + '/channels/' + channelId + '/media.json';
	return _execute(url, cb);
}

// list channels the media is present in
module.exports.listMediaChannels = function(mediaId, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/media/' + mediaId + '/channels.json';
	return _execute(url, cb);
}

// list all channels for the organization
module.exports.listAllChannels = function(cb) {
	// Get the request URL
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/channels/all.json';
    return _execute(url, cb);
}

// list available encodings for a media 
module.exports.listMediaEncodings = function(mediaId, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/media/' + mediaId + '/encodings.json';
	return _execute(url, cb);
}

// search with parameters as Limelight search API defines
module.exports.searchMedia = function(params, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + '/media/search.json';
	console.log('executing', url)
	return _execute(url, cb, params);
}

// list media properties
module.exports.listProperties = function(mediaId, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/media/' + mediaId + '/properties.json';
	return _execute(url, cb);
}

// list media cues
module.exports.listCues = function(mediaId, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/media/' + mediaId + '/cuepoints.json';
	return _execute(url, cb);
}


// update media cues for a given media
// @mediaId - media ID
// @cues - dictionary in the same format as specified in Limelight API. NOTE: JSON encoding is significant in the ad object
module.exports.updateCues = function(mediaId, cues, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/media/' + mediaId + '/cuepoints.json';
	return _execute(url, cb, cues, "POST");
}

// add a media into a channel
module.exports.putMediaToChannel = function(mediaId, channelId, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/channels/' + channelId + '/media/' + mediaId;
	console.log('put media', channelId);
	return _execute(url, cb, {}, "PUT");
}

// remove media from a channel
module.exports.removeMediaFromChannel = function(mediaId, channelId, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/channels/' + channelId + '/media/' + mediaId;
	return _execute(url, cb, {}, "DELETE");
}

// get media source download URL
module.exports.getMedia = function(mediaId, cb) {
	// Get the request URL.
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/media/' + mediaId + '/source.json';
	return _execute(url, cb);
}

// upload media to Limelight
module.exports.uploadMedia = function(props, cb) {
	// Get the request URL.
	console.log('upload info', props)
	var url =  'http://api.video.limelight.com/rest/organizations/' + organization + 
				'/media.json';
	return _execute(url, cb, props, "POST");
}

module.exports.ContentAPI = function(conf) {
	module.exports.config(conf);
	return module.exports;
}

// make the rquest to limelight API
// encode parameters and sign request according to Limelight conventions
// @url - request URI with no parameters
// @callback - callback called with standard (err, result) signature
// @params - dictionary of URL parameters to include
// @method - HTTP method in CAPS (like 'POST')

function _execute(url, callback, params, method) {
	if(!method) method = "GET";
	if(!secret || !secret.length) throw 'No access keys configured: ' + secret;
	// Sign the request using limelight.authenticate

	console.log('About to send to signing', method, url, access_key, params);
	var signed_url = limelight.authenticate(method, url, access_key, secret, params);
	
	if(method === 'POST' || method === 'PUT' || method === 'DELETE')   {
		//console.log(method, 'content', content);
		//console.log('POSTing to', signed_url);
		needle[method.toLowerCase()](signed_url, content, {multipart: true}, function (error, response, info) {
			//console.log(method + ' response:', info, response.statusCode, response.statusMessage);
			callback(error, info);
		});
	} else {
		needle.get(signed_url, function (error, response, info) {
			//console.log('Result:', response, info);
			callback(error, info);
		});
	}
}