var myID = "";
var p = false;


chrome.storage.sync.set({blacklist: []}, function(){
});
chrome.storage.sync.set({userID: myID}, function(){
});
chrome.storage.sync.set({isPaused: p}, function(){
});

chrome.runtime.onInstalled.addListener(function() {
  var identityPoolId = "74c6dd07-f78a-40f2-9b1b-307864401890";
  var bucketRegion = "us-east-1";
  var bucketName = "plugin-browsing-data";
  AWS.config.region = 'us-east-1'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:0a3c0c55-0f25-4158-b7b5-57db8e393ac4',
});

  var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: {
      Bucket: bucketName
    }
  });

  //for debugging
  var identityId = AWS.config.credentials.identityId;
  console.log(identityId);


  var uploadToS3 = function(url) {
    chrome.storage.sync.get('userID', function(temp) {
      var currID = "" + temp.userID;
      var f = JSON.stringify({

        name: currID,
        recordedurl: url,
        time: new Date()
      });
      console.log(f, url);
      //return;
      s3.upload(
        {
          Bucket: bucketName,
          Key: (currID + " " + Date()),
          Body: f
        },
        function(err, data) {
          console.log(err, data);
        }
      );

    })
  };

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // don't do anything if url hasn't changed
    var myURL = "" + tab.url;
    if (!changeInfo.url) return;
    chrome.storage.sync.get(['isPaused'], function(temp){
      var pause = temp.isPaused;
      if (!pause){
        chrome.storage.sync.get({blacklist: []}, function(temp2) {
          var bl = temp2.blacklist;
          var m = 0;
          for (var i = 0; i < bl.length; i++){
            var t = "" + bl[i];
            if (myURL.includes(t)){
              m++;
            }
          }
          if (m === 0){
            uploadToS3(changeInfo.url);
            console.log("Uploaded");
          } else {
            console.log("Blacklisted");
            return;
          }
        });
      }
    });
  })

  chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
      var myURL = "" + tab.url;
      if (!tab.url || tab.url.includes("chrome://")) return;
      chrome.storage.sync.get(['isPaused'], function(temp){
        var pause = temp.isPaused;
        if (!pause){
          chrome.storage.sync.get({blacklist: []}, function(temp2) {
            var bl = temp2.blacklist;
            var m = 0;
            for (var i = 0; i < bl.length; i++){
              var t = "" + bl[i];
              if (myURL.includes(t)){
                m++;
              }
            }
            if (m === 0){
              uploadToS3(tab.url);
              console.log("Uploaded");
            } else {
              console.log("Blacklisted");
              return;
            }
          });
        }
      });
      // uncomment line below if you want the code to run when user simply switches/activates tabs

    });
  });
});
