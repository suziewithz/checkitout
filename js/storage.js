var CartDataName = "extensionCartDataList";
var CartStorage = {
  setValue : function(value,callback) {
    var obj = {};
    obj[CartDataName] = value;
    chrome.storage.local.set(obj, function() {
        if(callback) {
            callback();
        }
    });
  },
  load : function(callback) {
    chrome.storage.local.get(CartDataName, function(data) {
        if(callback) {
            callback(data[CartDataName]);
        }
    });
  },
  clear : function(callback) {
    chrome.storage.local.clear(function() {
        if(callback) {
            callback();
        }
    });
  }
};


// function DB_load(callback) {
//     chrome.storage.local.get(CartDataName, function(data) {
//         if (isEmpty(data[CartDataName])) {
//             DB_setValue(ExtensionDataName, ExtensionData, callback);
//         } else if (data[ExtensionDataName].dataVersion != ExtensionData.dataVersion) {
//             DB_setValue(ExtensionDataName, ExtensionData, callback);
//         } else {
//             ExtensionData = data[ExtensionDataName];
//             callback();
//         }
//     });
// }

// function isEmpty(obj) {
//     for(var prop in obj) {
//         if(obj.hasOwnProperty(prop))
//             return false;
//     }
//     return true;
// }

// DB_load(function() {
//     //YOUR MAIN CODE WILL BE HERE
//     console.log(ExtensionData);
//     console.log(ExtensionData.villages); //array of villages
//     console.log(ExtensionData.villages[0]); //first village object
//     console.log(ExtensionData.villages[0].id); //first village id
//     console.log(ExtensionData.villages[0].name); //first village name

//     //HOW TO ITERATE VILLAGES

//     for (var i = 0; i < ExtensionData.villages.length; i++) {
//         console.log(ExtensionData.villages[i].id); //village id
//         console.log(ExtensionData.villages[i].name); //village name
//     } 
// });