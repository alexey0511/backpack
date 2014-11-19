var friendCache = {};

function getMe(callback) {
  FB.api('/me', {fields: 'id,name,first_name,picture.width(120).height(120)'}, function(response){
    if( !response.error ) {
      friendCache.me = response;
      callback();
    } else {
      console.error('/me', response);
    }
  });
}

function sendChallenge(to, message, callback) {
alert("send");
////  var options = {
//    method: 'apprequests'
//  };
//  if(to) options.to = to;
//  if(message) options.message = message;
//  FB.ui(options, function(response) {
//    if(callback) callback(response);
//  });
}