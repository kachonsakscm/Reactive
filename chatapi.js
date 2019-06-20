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
		},		
		refreshChat: function(url) {		
			this._chatapi._refreshChat(url);
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
			console.log(formchat.search("ChatCookie"));
			if(formchat.search("ChatCookie") >= 0)
			{
				//me._config.baseURL = 10;
				console.log(ChatId);
				
				me._startChatRefresh();
				me._refreshChat();
				console.log("เคส1");
				me._config.onStarted();
				me._getlimitfileChat();
			}
			else
			{
				
				
				var url = me._config.baseURL + '/chat/' + me._config.chatServiceName;
				const request = new XMLHttpRequest();
				//request.responseType = "json";
				request.open("POST", url,true);
				request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				request.onerror = function() {
					if(request.status == 0)
					{	internet = false;
						if(wgLanguage == "TH")
						{
							onMessageAlert(dataMessageTH["Error-408"]);
						}
						else if(wgLanguage == "EN")
						{
							onMessageAlert(dataMessageEN["Error-408"]);
						}
					}
					else
					{
						me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
					}						
						console.log(request.status);
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
						UserId = oo.userId;
						SecureKey = oo.secureKey;
						Alias = oo.alias;
						TranscriptPosition = 1;
						ChatId = oo.chatId;
						// Let listeners know that the chat session started successfully
						me._config.onStarted();
						me._getlimitfileChat();
						// Start the interval polling for transcript updates
						me._startChatRefresh();
						me._refreshChat();
						console.log("เคส2");
						
					}					
				}
				request.send(formchat);
			}
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
				if(request.status == 0)
				{						
					if(wgLanguage == "TH")
					{
						onMessageAlert(dataMessageTH["Error-408"]);					
					}
					else if(wgLanguage == "EN")
					{
						onMessageAlert(dataMessageEN["Error-408"]);
					}
				}
				else
				{
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}						
				console.log(request.status);
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
				if(request.status == 0)
				{			
					if(wgLanguage == "TH")
					{
						onMessageAlert(dataMessageTH["Error-408"]);					
					}
					else if(wgLanguage == "EN")
					{
						onMessageAlert(dataMessageEN["Error-408"]);					
					}
				}
				else
				{
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}						
				console.log(request.status);
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 ){ 
					if(request.status == 200){
						if ( me._config.debug === true ) {
							console.log("sendMessage response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
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
				
				console.log("เคส3");
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
			if(chat == "ChatCookie")					
			{		
				me._userId = UserId;		
				me._secureKey = SecureKey;		
				me._alias = Alias;		
				me._transcriptPosition = TranscriptPosition;		
				me._chatId = ChatId;		
				console.log(me._userId);		
				console.log(me._secureKey);		
				console.log(me._alias);		
				console.log(me._transcriptPosition);		
				console.log(me._chatId);		
				chat = "";		
			}
			var params = 'userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias + '&transcriptPosition=' + me._transcriptPosition;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/refresh';
			const request = new XMLHttpRequest();
			//request.responseType = "json";
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				if(request.status == 0)
				{	internet = false;
					console.log(wgLanguage);
					if(wgLanguage == "TH")
					{
					onMessageAlert(dataMessageTH["Error-0"]);
					}
					else if(wgLanguage == "EN")
					{
					onMessageAlert(dataMessageEN["Error-0"]);
					}
				}
				else
				{
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}						
				console.log(request.status);		
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 && request.status == 200){ 
					if(internet == false)
					{
						$(".comfirm-end-background").addClass("hide");
						$(".comfirm-end-box").addClass("hide");
						internet = true;
					}
					if ( me._config.debug === true ) {
						console.log("_refreshChat response -> "+JSON.stringify(request.responseText));
					}
					// Update the transcript position
					
					var oo = JSON.parse(request.responseText);
					console.log(oo.chatEnded);
					console.log(oo.errors);
					if((oo.chatEnded == true && !oo.errors && internet == false)||(oo.chatEnded == true && !oo.errors || internet == false)||(oo.chatEnded == true && oo.errors && internet == false))
					{
						
						me._stopChatRefresh();
						console.log("เข้าเคสรีเฟลชไม่ปกติ");
						setCookie("username", user, 0.00001);
						createMessage(wgMsgAgent,wgSystem[wgLanguage]["messageresponse"]["Leftchat"]);
						createMessage(wgMsgCustomer,wgSystem[wgLanguage]["messageresponse"]["Leftchat"]); 
						removeTyping();
						$('#btn-Send').prop('disabled', true);
						$('#uploadfile').prop('disabled', true);
						// $('#btn-emoji').prop('disabled', true);
						document.getElementById("btn-emoji").disabled = true;
						$('#messagechat').prop('disabled', true);
						internet = true;
					}
					else if(!oo.chatEnded && !oo.errors && internet)
					{
						user = "ChatCookie";		
						console.log("user2 : "+user);		
						setCookie("username", user, 0.00105);
						internet = true;
						console.log("เข้าเคสรีเฟลชได้ปกติ");
						me._transcriptPosition = oo.nextPosition;
						// For each item in the transcript...
						$.each(oo.messages, function(index, message) {
							console.log("message : "+JSON.stringify(message));	
							if(message.type === "FileUploaded"){
								me._config.onFileReceived(message.from.type, message.from.nickname,message.userData);
							} else{
								console.log("เข้ามีส่งข้อความ");
								me._config.onMessageReceived(message.from.type,message.type, message.from.nickname, message.text, oo.chatEnded);
							}
						});
					}
					
					// If the chat has ended, perhaps by the agent ending the chat, then
					// stop the interval object from polling for transcript updates
					if ( oo.chatEnded == true ) {
						me._stopChatRefresh();
						me._config.onEnded()
					}
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
				if(request.status == 0)
				{	
					
					if(wgLanguage == "TH")
					{
					onMessageAlert(dataMessageTH["Error-408"]);
					}
					else if(wgLanguage == "EN")
					{
					onMessageAlert(dataMessageEN["Error-408"]);
					}
				}
				else
				{
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}						
				console.log(request.status);	
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
						
				}
			}
			request.send(params);
		},
		
		_getlimitfileChat: function() {
        	var me = this;
			console.log("เข้าgetlimitfile");			
			console.log(me._userId);		
			console.log(me._secureKey);		
			console.log(me._alias);		
			console.log(me._transcriptPosition);		
			console.log(me._chatId);
			var params = 'userId=' + me._userId + '&secureKey=' + me._secureKey + '&alias=' + me._alias;
			var url = me._config.baseURL + '/chat/' + me._config.chatServiceName + '/' + me._chatId + '/file/limits';
			const request = new XMLHttpRequest();
			// request.responseType = "json";
			request.open("POST", url);
			request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			request.onerror = function() {
				if(request.status == 0)
				{	
					if(wgLanguage == "TH")
					{
					onMessageAlert(dataMessageTH["Error-408"]);
					}
					else if(wgLanguage == "EN")
					{
					onMessageAlert(dataMessageEN["Error-408"]);
					}
				}
				else
				{
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}						
				console.log(request.status);	
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
			
			if(me._uploadFileTypes.search(sptname[sptname.length-1].toLowerCase()) == -1){
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
				if(request.status == 0)
				{	
					if(wgLanguage == "TH")
					{
					onMessageAlert(dataMessageTH["Error-408"]);
					}
					else if(wgLanguage == "EN")
					{
					onMessageAlert(dataMessageEN["Error-408"]);
					}
				}
				else
				{
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}						
				console.log(request.status);			 
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
				if(request.status == 0)
				{	
					if(wgLanguage == "TH")
					{
					onMessageAlert(dataMessageTH["Error-408"]);
					}
					else if(wgLanguage == "EN")
					{
					onMessageAlert(dataMessageEN["Error-408"]);
					}
				}
				else
				{
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}						
				console.log(request.status);		
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 ){ 
					if(request.status == 200){
					
						if ( me._config.debug === true ) {
							console.log("startTyping response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
						me._readReceiptChat();
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
				if(request.status == 0)
				{	
					if(wgLanguage == "TH")
					{
					onMessageAlert(dataMessageTH["Error-408"]);
					}
					else if(wgLanguage == "EN")
					{
					onMessageAlert(dataMessageEN["Error-408"]);
					}
				}
				else
				{
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}						
				console.log(request.status);		
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4){ 
					if(request.status == 200){
					
						if ( me._config.debug === true ) {
							console.log("stopTyping response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
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
				if(request.status == 0)
				{	
					if(wgLanguage == "TH")
					{
					onMessageAlert(dataMessageTH["Error-408"]);
					}
					else if(wgLanguage == "EN")
					{
					onMessageAlert(dataMessageEN["Error-408"]);
					}
				}
				else
				{
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}						
				console.log(request.status);		
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4){ 
					if(request.status == 200){
				
						if ( me._config.debug === true ) {
							console.log("readReceipt response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
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
				if(request.status == 0)
				{	
					if(wgLanguage == "TH")
					{
					onMessageAlert(dataMessageTH["Error-408"]);
					}
					else if(wgLanguage == "EN")
					{
					onMessageAlert(dataMessageEN["Error-408"]);
					}
				}
				else
				{
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}						
				console.log(request.status);		
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4 ){ 
					if(request.status == 200){
						if ( me._config.debug === true ) {
							console.log("pushUrl response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
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
				if(request.status == 0)
				{	
					if(wgLanguage == "TH")
					{
					onMessageAlert(dataMessageTH["Error-408"]);
					}
					else if(wgLanguage == "EN")
					{
					onMessageAlert(dataMessageEN["Error-408"]);
					}
				}
				else
				{
					me._config.onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-401"]);
				}						
				console.log(request.status);		
			}
			request.onreadystatechange = function() {
				if(request.readyState == 4){ 
					if(request.status == 200){
						if ( me._config.debug === true ) {
							console.log("updateData response -> "+JSON.stringify(request.responseText));
						}
						var oo = JSON.parse(request.responseText);
					}
				}
			}
			request.send(params);
        }
		
		// //send email
		// startChat: function(formchat) {
			// var me = this;
			
				// var url = me._config.baseURL + '/chat/' + me._config.chatServiceName;
				// const request = new XMLHttpRequest();
				// //request.responseType = "json";
				// request.open("POST", url,true);
				// request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				// request.onerror = function() {
	
				// }
				// request.onreadystatechange = function() {
					// if(request.readyState == 4 && request.status == 200) {
						// if ( me._config.debug === true ) {
							// console.log("startChat responseqq -> "+JSON.stringify(request.responseText));
						// }
						// var oo = JSON.parse(request.responseText);
						
						
					// }					
				// }
				// request.send(formchat);
			// }
        // }
		
    });
};