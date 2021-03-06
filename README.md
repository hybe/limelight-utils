# limelight-utils
An easy-to-use Javascript API wrapper for accessing the Limelight Orchestrate Video REST API. 
Mainly developed to be used as a node.js module.

# Usage

- `npm install limelight-utils`
- `require limelight-utils`
- provide configuration with config() or ContentAPI
- use the API

```javascript
var conf = {
	limelight : {
		organization: '<ORGANIZATION_ID>',
		accessKey: '<LIMELIGHT_ACCESS_KEY>',
		secret: '<LIMELIGHT_SECRET_KEY>'
	}
}
var limelight = require('limelight-utils').ContentAPI(conf)

limelight.listChannelGroups(function(err, res) {
	console.log('Channel Groups', res)
})
```

# API
The API is a thin wrapper around the Limelight Orchestra Content API. At the current version 
it's not doing a whole lot of error checking etc on the parameters (pull requests welcome!) 
so if you get an empty response, that might be the reason. Typically, the Limelight REST API doesn't 
provide very useful error messages in malformed request parameter cases, so if you get empty responses, that
is most likely the reason.

In most methods the parameters are self explanatory, URL parameters and strutures are typically 
passed through as-is. Refer to [Limelight documentation](http://support.video.limelight.com/support/docs/content_api/)

### list all channel groups
listChannelGroups (cb)

### list channels in a channel group
listChannels (groupId, cb) 

### get properties of a channel
listChannelProperties (channelId, cb)

### list media in a channel
listMedia (channelId, cb) 

### list channels the media is present in
listMediaChannels (mediaId, cb)

### list all channels for the organization
listAllChannels (cb)

### list available encodings for a media 
listMediaEncodings (mediaId, cb)

### search with parameters as the Limelight search API defines
searchMedia (params, cb)

### list media properties
listProperties (mediaId, cb) 

### list media cues
listCues (mediaId, cb) 

### update media cues for a given media
- mediaId - media ID
- cues - dictionary in the same format as specified in Limelight API. NOTE: JSON encoding is significant in the ad object

updateCues (mediaId, cues, cb) 

The `cues` parameter should be an *array* of Limelight cue JSON objects such as this:
```javascript
{
  "placement":"BEFORE",
  "startPositionInMilliseconds":-2147483648,
  "endPositionInMilliseconds":-2147483648,
  "name":"Pre-Roll (via web)",
  "index":0,
  "details": JSON.stringify({
    "adType":"VAST",
    "isOverlay":false,
    "trackingPixelUrls": "<trackingPixelUrl>",
    "adDetails": {
      "url":"<adurl>"
  	}
  })          
}
```

### add a media into a channel
putMediaToChannel (mediaId, channelId, cb)

### remove media from a channel
removeMediaFromChannel (mediaId, channelId, cb)

### get media source download URL
getMedia (mediaId, cb) 

### upload media to Limelight
uploadMedia (props, cb) 

