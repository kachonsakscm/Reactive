var ChatFactory = function(config) {

	var apiObj = Chat.createAPIv2();
	apiObj.init(config);

	// Create an instance of a wrapper class that encapsulates the chat API implementation
	var chatObj = {
		_chatapi: apiObj,
		
		startChat: function(formchat) {
			this._chatapi.startChat(formchat);
		},
		
		endChat: function() {
			this._chatapi.endChat();
		},
		
		sendMessage: function(message) {
			this._chatapi.sendMessage(message);
		},
		
		downloadfileChat: function(fileId,fileName) {
			this._chatapi.downloadfileChat(fileId,fileName);
		},
		
		uploadfileChat: function(fileup) {
			this._chatapi.uploadfileChat(fileup);
		},
		startTypingChat: function(){
				this._chatapi.startTypingChat();
		},
		stopTypingChat: function(){
				this._chatapi.stopTypingChat();
		},
		pushUrlChat: function(url) {
			this._chatapi.pushUrlChat(url);
		},
		updateUserDataChat: function(url) {
			this._chatapi.updateUserDataChat(url);
		}
	}
	
	// Return the wrapper class to the caller
	return chatObj;
}

// IE doesn't support Object.create() so implement a version of it that will work for our needs
if (!Object.create) {  
    Object.create = function (o) {
        if (arguments.length > 1) {
            throw new Error('Object.create implementation only accepts the first parameter.');
        }
        function F() {}
        F.prototype = o;
        return new F();
    };
}

// This merges the properties of two classes together to allow for object inheritance 
var fromPrototype = function(prototype, object) {  
    var newObject = Object.create(prototype);
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            newObject[prop] = object[prop];
        }
    }
  	return newObject;
};

// Our base Chat class implementation to be overridden by the implementation classes
var Chat = { 
	init: function(config) {}, 
    startChat: function(formchat) {},
    endChat: function() {},
    sendMessage: function(message) {}
};

// An implementation of the Genesys Chat API v2
//
// Genesys Chat API v2 is the API implemented and used by Genesys Web Engagement
// It previously used to be exposed by a component known at Genesys WebAPI Server,
// but is now hosted by GMS.
//
// It differs from Chat API v1 in that no Orchestration session is created, and it
// DOES NOT offer a CometD event channel.
//
// Note, this class does not implement the entire API, but just enough to show the
// basics of how the API works.
//
Chat.createAPIv2 = function(config) {  
    
    return fromPrototype(Chat, {
    	_config: {},
    	_chatId: null,
    	_userId: null,
    	_secureKey: null,
    	_alias: null,
    	_transcriptPosition: 1,
    	_chatRefreshIntervalId: null,
		_downloadAttempts: null,
		_uploadMaxFiles: null,
		_uploadMaxFileSize: null,
		_uploadMaxTotalSize: null,
		_uploadNeedAgent: null,	
		_uploadFileTypes: null,
		_usedUploadMaxFiles: null,	
		_usedUploadMaxTotalSize: null,
		_usedDownloadAttempts: null,
    	
    	// Initialize the Chat API v2 Class
    	init: function(config) {
    		var me = this;
			
			// Save off the config object for later use
			me._config = config;
			
			// Modify the config.baseURL to reflect the API v2 URI
			me._config.baseURL = me._config.baseURL + '/genesys/2';
    	},
    	
    	// Start the Chat with the formchat values
        startChat: function(formchat) {
        
        	var me = this;
        	
        	var url = me._config.baseURL + '/chat/' + me._config.chatServiceName;
			const request = new XMLHttpRequest();
			//request.responseType = "json";
			request.open("POST", url,true);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 && request.status == 200) {
					if ( me._config.debug === true ) {
						console.log("startChat responseqq -> "+JSON.stringify(request.responseText));
					}
					var oo = JSON.parse(request.responseText);
					me._chatId = oo.chatId;
					me._userId = oo.userId;
					me._secureKey = oo.secureKey;
					me._alias = oo.alias;
					// Save off the transcript position
					me._transcriptPosition = 1;
					
					// Let listeners know that the chat session started successfully
					me._config.onStarted();
					me._getlimitfileChat();
					// Start the interval polling for transcript updates
					me._startChatRefresh();
					me._refreshChat();
					
				}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
				}else if(request.status == 103){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
				}else if(request.status == 161){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
				}else if(request.status == 204){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
				}else if(request.status == 401){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}else if(request.status == 403){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
				}else if(request.status == 404){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
				}else if(request.status == 405){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
				}else if(request.status == 406){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
				}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
				}else if(request.status == 500){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
				}else if(request.status == 502){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
				}else if(request.status == 504){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
				}
				
				
			}
			request.send(formchat);
        },
        
        // End the chat session
        endChat: function() {
        
        	var me = this;
        
        	// Populate the parameters and URL
			var params = 'userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/disconnect';
			const request = new XMLHttpRequest();
			// request.responseType = "json";
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 ){ 
					if(request.status == 200){
						if ( me._config.debug === true ) {
							console.log("endChat response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
						
						// Stop the interval polling for transcript updates
						me._stopChatRefresh();
						
						// Clear out the session values
						me._chatId = oo.chatId;
						me._userId = oo.userId;
						me._secureKey = oo.secureKey;
						me._alias = oo.alias;
						me._transcriptPosition = 1;
						
						// Let the listeners know that the chat has ended
						me._config.onEnded();
					}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
					}else if(request.status == 103){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
					}else if(request.status == 161){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
					}else if(request.status == 204){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
					}else if(request.status == 401){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
					}else if(request.status == 403){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
					}else if(request.status == 404){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
					}else if(request.status == 405){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
					}else if(request.status == 406){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
					}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
					}else if(request.status == 500){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
					}else if(request.status == 502){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
					}else if(request.status == 504){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
					}
				}
			}
			request.send(params);
        },
        
        // Send a message
        sendMessage: function(message) {
        
        	var me = this;
			message = encodeURIComponent(message);
        	// Populate the parameters and URL
			// if(message.search("&") != -1)
			// {
				// var spatext = message.search("&");
				// console.log(spatext);
				// if(spatext > 0)
				// {
					// var text2 = message.substring(0,spatext);
					// console.log(spatext);
					// console.log(message.length);
					// if(message.search("&") < message.length)
					// {	
						
						// var text3 = message.substring(spatext+1,message.length);
						// console.log(text3);
						// message = text2+"%26"+text3;
					// }
					// else
					// {
						// message = text2+"%26";
					// }
				// }	
				// else
				// {
					// if(message.search("&") < message.length)
					// {	
						
						// var text4 = message.substring(spatext+1,message.length);
						// console.log(text3);
						// message = "%26"+text4;
					// }
					// else
					// {
						// message = "%26";
					// }
				// }
				// console.log(message);
			// }
			// else if(message.search("[+]") != -1)
			// {
				// var spatext = message.search("[+]");
				// console.log(spatext);
				// if(spatext > 0)
				// {
					// var text2 = message.substring(0,spatext);
					// console.log(spatext);
					// console.log(message.length);
					// if(message.search("[+]") < message.length)
					// {	
						
						// var text3 = message.substring(spatext+1,message.length);
						// console.log(text3);
						// message = text2+"%2B"+text3;
					// }
					// else
					// {
						// message = text2+"%2B";
					// }
				// }	
				// else
				// {
					// if(message.search("[+]") < message.length)
					// {	
						
						// var text4 = message.substring(spatext+1,message.length);
						// console.log(text3);
						// message = "%2B"+text4;
					// }
					// else
					// {
						// message = "%2B";
					// }
				// }
				// console.log(message);
			// }
			// else if(message.search("%") != -1)
			// {
				// var spatext = message.search("%");
				// console.log(spatext);
				// if(spatext > 0)
				// {
					// var text2 = message.substring(0,spatext);
					// console.log(spatext);
					// console.log(message.length);
					// if(message.search("%") < message.length)
					// {	
						
						// var text3 = message.substring(spatext+1,message.length);
						// console.log(text3);
						// message = text2+"%25"+text3;
					// }
					// else
					// {
						// message = text2+"%25";
					// }
				// }	
				// else
				// {
					// if(message.search("%") < message.length)
					// {	
						
						// var text4 = message.substring(spatext+1,message.length);
						// console.log(text4);
						// message = "%25"+text4;
					// }
					// else
					// {
						// message = "%25";
					// }
				// }
				// console.log(message);
			// }
			var params = 'message=' + message + '&userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/send';
			const request = new XMLHttpRequest();
			// request.responseType = "json";
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 ){ 
					if(request.status == 200){
						if ( me._config.debug === true ) {
							console.log("sendMessage response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
					}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
					}else if(request.status == 103){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
					}else if(request.status == 161){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
					}else if(request.status == 204){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
					}else if(request.status == 401){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
					}else if(request.status == 403){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
					}else if(request.status == 404){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
					}else if(request.status == 405){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
					}else if(request.status == 406){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
					}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
					}else if(request.status == 500){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
					}else if(request.status == 502){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
					}else if(request.status == 504){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
					}
				}
			}
			request.send(params);
        },
        
		// Start an interval object to make 'refresh' requests at 5 second intervals
		_startChatRefresh: function() {
			
			var me = this;
			
			me._chatRefreshIntervalId = setInterval( function() {
				me._refreshChat();
			}, 5000);
		},
		
		// Stop the interval object from making 'refresh' requests		
		_stopChatRefresh: function() {
			
			var me = this;
			
			clearInterval(me._chatRefreshIntervalId);
		},
		
		// Refresh the Chat transcript by making a 'refresh' request
		_refreshChat: function() {
		
			var me = this;
			
			var params = 'userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias + '&transcriptPosition=' + me._transcriptPosition;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/refresh';
			const request = new XMLHttpRequest();
			//request.responseType = "json";
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				 
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 && request.status == 200){ 
					if ( me._config.debug === true ) {
						console.log("_refreshChat response -> "+JSON.stringify(request.responseText));
					}
					// Update the transcript position
					var oo = JSON.parse(request.responseText);
					me._transcriptPosition = oo.nextPosition;
					// For each item in the transcript...
					$.each(oo.messages, function(index, message) {
						console.log("message : "+JSON.stringify(message));	
						if(message.type === "FileUploaded"){
							me._config.onFileReceived(message.from.type, message.from.nickname,message.userData);
						} else{
							me._config.onMessageReceived(message.from.type,message.type, message.from.nickname, message.text, oo.chatEnded);
						}
					});
					
					// If the chat has ended, perhaps by the agent ending the chat, then
					// stop the interval object from polling for transcript updates
					if ( oo.chatEnded == true ) {
						me._stopChatRefresh();
						me._config.onEnded()
					}
				}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
				}else if(request.status == 103){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
				}else if(request.status == 161){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
				}else if(request.status == 204){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
				}else if(request.status == 401){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}else if(request.status == 403){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
				}else if(request.status == 404){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
				}else if(request.status == 405){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
				}else if(request.status == 406){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
				}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
				}else if(request.status == 500){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
				}else if(request.status == 502){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
				}else if(request.status == 504){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
				}
			}
			request.send(params);
			
		},
		
		downloadfileChat: function(fileId,fileName){
			var me = this;
			
			me._usedDownloadAttempts = parseInt(me._usedDownloadAttempts);
			me._downloadAttempts = parseInt(me._downloadAttempts);
			console.log(me._usedDownloadAttempts);
			console.log("มากกว่า");
			console.log(me._downloadAttempts);
			if(me._usedDownloadAttempts >= me._downloadAttempts){				
				
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-Download-Attemps"]);
				return;
			}
			
			var params = 'userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/file/'+fileId+'/download';
			const request = new XMLHttpRequest();
			//if(!isIE)
			//{
				request.onloadstart = function(ev) {
					request.responseType = "blob";
				}
				//request.responseType = "blob";
			//}
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
			}
			request.onreadystatechange = function() {
				
				if(request.readyState == 4 && request.status == 200){ 
						if ( me._config.debug === true ) {
							console.log("downloadfileChat response -> "+JSON.stringify(request.response));
						}
						me._getlimitfileChat();
						if(isIE)
						{
							me._config.onDownloadFileIE(request.response,fileName);
						}
						else
						{
							me._config.onDownloadFile(request.response,fileName);
						}
						
				}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
				}else if(request.status == 103){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
				}else if(request.status == 161){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
				}else if(request.status == 204){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
				}else if(request.status == 401){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}else if(request.status == 403){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
				}else if(request.status == 404){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
				}else if(request.status == 405){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
				}else if(request.status == 406){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
				}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
				}else if(request.status == 500){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
				}else if(request.status == 502){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
				}else if(request.status == 504){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
				}
			}
			request.send(params);
		},
		
		_getlimitfileChat: function() {
        	var me = this;
			var params = 'userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/file/limits';
			const request = new XMLHttpRequest();
			// request.responseType = "json";
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 ){ 
					if(request.status == 200){
					
						if ( me._config.debug === true ) {
							console.log("getlimitfileChat response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
						var temp = oo.messages[0].userData;
						me._downloadAttempts = temp["download-attempts"];
						me._uploadMaxFiles = temp["upload-max-files"];
						me._uploadMaxFileSize = temp["upload-max-file-size"];
						me._uploadMaxTotalSize = temp["upload-max-total-size"];
						me._uploadNeedAgent = temp["upload-need-agent"];	
						me._uploadFileTypes = temp["upload-file-types"];
						me._usedUploadMaxFiles = temp["used-upload-max-files"];
						me._usedUploadMaxTotalSize = temp["used-upload-max-total-size"];
						me._usedDownloadAttempts = temp["used-download-attempts"];
					}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
					}else if(request.status == 103){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
					}else if(request.status == 161){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
					}else if(request.status == 204){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
					}else if(request.status == 401){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
					}else if(request.status == 403){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
					}else if(request.status == 404){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
					}else if(request.status == 405){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
					}else if(request.status == 406){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
					}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
					}else if(request.status == 500){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
					}else if(request.status == 502){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
					}else if(request.status == 504){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
					}
				}
			}
			request.send(params);		
        },
		
		
		uploadfileChat: function(fileup){
			var me = this;
			me._usedUploadMaxFiles = parseInt(me._usedUploadMaxFiles);
			me._uploadMaxFiles = parseInt(me._uploadMaxFiles);
			me._usedUploadMaxTotalSize = parseInt(me._usedUploadMaxTotalSize);
			me._uploadMaxTotalSize = parseInt(me._uploadMaxTotalSize);
			
			if(fileup[0].size > me._uploadMaxFileSize){
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-Max-File-Size"])
				return;
			}
			
			var sptname =  fileup[0].name.split(".");
			
			if(me._uploadFileTypes.search(sptname[sptname.length-1]) == -1){
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-File-Types"])
				return;
			}	
			
			if(me._usedUploadMaxFiles >= me._uploadMaxFiles){
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-Upload-Max-Files"])
				return;
			}
			
			if(me._usedUploadMaxTotalSize >= me._uploadMaxTotalSize){
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-Max-Total-Size"])
				return;
			}
			
			//var params = 'userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias + '&file=' + fileup[0];
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/file';		
			var formData = new FormData();
			formData.append('userId', me._userId);
			formData.append('secureKey',me._secureKey);
			formData.append('alias',me._alias);
			formData.append('file',fileup[0]);
			
			console.log(formData);
			const request = new XMLHttpRequest();
			// request.responseType = "json";
			request.open("POST", url,true);
			request.setRequestHeader("Accept","*/*");
			// request.setRequestHeader("Content-Type",!1);
			request.overrideMimeType("multipart/form-data;");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 ){ 
					$("#uploadfile").val(null);
					if(request.status == 200){
						if ( me._config.debug === true ) {
							console.log("uploadfile response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
						me._getlimitfileChat();
					}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
					}else if(request.status == 103){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
					}else if(request.status == 161){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
					}else if(request.status == 204){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
					}else if(request.status == 401){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
					}else if(request.status == 403){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
					}else if(request.status == 404){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
					}else if(request.status == 405){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
					}else if(request.status == 406){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
					}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
					}else if(request.status == 500){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
					}else if(request.status == 502){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
					}else if(request.status == 504){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
					}
				}
			}
			request.send(formData);
			
		},
		
		 startTypingChat: function() {
        
        	var me = this;
        
        	// Populate the parameters and URL
			var params = '&userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/startTyping';
			const request = new XMLHttpRequest();
			// request.responseType = "json";
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 ){ 
					if(request.status == 200){
					
						if ( me._config.debug === true ) {
							console.log("startTyping response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
						me._readReceiptChat();
					}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
					}else if(request.status == 103){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
					}else if(request.status == 161){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
					}else if(request.status == 204){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
					}else if(request.status == 401){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
					}else if(request.status == 403){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
					}else if(request.status == 404){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
					}else if(request.status == 405){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
					}else if(request.status == 406){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
					}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
					}else if(request.status == 500){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
					}else if(request.status == 502){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
					}else if(request.status == 504){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
					}
				}
			}
			request.send(params);
        },
		
		 stopTypingChat: function() {
        
        	var me = this;
        
        	// Populate the parameters and URL
			var params = '&userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/stopTyping';
			const request = new XMLHttpRequest();
			// request.responseType = "json";
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4){ 
					if(request.status == 200){
					
						if ( me._config.debug === true ) {
							console.log("stopTyping response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
					}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
					}else if(request.status == 103){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
					}else if(request.status == 161){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
					}else if(request.status == 204){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
					}else if(request.status == 401){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
					}else if(request.status == 403){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
					}else if(request.status == 404){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
					}else if(request.status == 405){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
					}else if(request.status == 406){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
					}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
					}else if(request.status == 500){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
					}else if(request.status == 502){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
					}else if(request.status == 504){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
					}
				}
			}
			request.send(params);
        },
		
		_readReceiptChat: function() {
        
        	var me = this;
        
        	// Populate the parameters and URL
			var params = '&userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias + '&transcriptPosition=' + me._transcriptPosition;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/readReceipt';
			const request = new XMLHttpRequest();
			// request.responseType = "json";
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4){ 
					if(request.status == 200){
				
						if ( me._config.debug === true ) {
							console.log("readReceipt response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
					}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
					}else if(request.status == 103){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
					}else if(request.status == 161){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
					}else if(request.status == 204){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
					}else if(request.status == 401){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
					}else if(request.status == 403){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
					}else if(request.status == 404){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
					}else if(request.status == 405){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
					}else if(request.status == 406){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
					}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
					}else if(request.status == 500){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
					}else if(request.status == 502){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
					}else if(request.status == 504){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
					}
				}
			}
			request.send(params);
        },
		
		pushUrlChat: function(url) {
        
        	var me = this;
        
        	// Populate the parameters and URL
			var params = '&userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias + '&pushUrl=' + url;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/pushUrl';
			const request = new XMLHttpRequest();
			// request.responseType = "json";
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 ){ 
					if(request.status == 200){
						if ( me._config.debug === true ) {
							console.log("pushUrl response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
					}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
					}else if(request.status == 103){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
					}else if(request.status == 161){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
					}else if(request.status == 204){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
					}else if(request.status == 401){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
					}else if(request.status == 403){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
					}else if(request.status == 404){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
					}else if(request.status == 405){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
					}else if(request.status == 406){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
					}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
					}else if(request.status == 500){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
					}else if(request.status == 502){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
					}else if(request.status == 504){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
					}
				}
			}
			request.send(params);
        },
		
		updateUserDataChat: function(arrData) {
        
			var uData = "";
			for(var key in arrData){
				uData += "&userData[\""+key+"\"]="+arrData[key].trim();
			}
        	var me = this;
        	// Populate the parameters and URL
			var params = '&userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias + uData;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/updateData';
			const request = new XMLHttpRequest();
			// request.responseType = "json";
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4){ 
					if(request.status == 200){
						if ( me._config.debug === true ) {
							console.log("updateData response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
					}else if(request.status == 102){
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-102"]);
					}else if(request.status == 103){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-103"]);
					}else if(request.status == 161){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-161"]);
					}else if(request.status == 204){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-204"]);
					}else if(request.status == 401){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
					}else if(request.status == 403){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-403"])
					}else if(request.status == 404){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-404"])
					}else if(request.status == 405){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-405"])
					}else if(request.status == 406){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-406"])
					}else if(request.status == 408){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-408"])
					}else if(request.status == 500){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-500"])
					}else if(request.status == 502){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-502"])
					}else if(request.status == 504){
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-504"])
					}
				}
			}
			request.send(params);
        }
		
    });
};