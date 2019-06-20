	var paramUrl = {};
    var langweb ;
	var dateMsg = "";
	var dataMessage = {};
	var dataFunction = {};
	var oChat;
	var oChatStart = false;
	var timeEng;
	var click = false;	
	var SplashMes = [];
	var isewt = false;
	var end = false;
	var selecInten = false;
	var SmsTime;
	var firstmessage = true;
	var chanelselect = true;
	
	window.onload = function() {
	getpara();		
		document.getElementById("formchat").style.display = "none";
		// $("#formchat").fadeIn();
		$(".Live").fadeIn();
		for(var i=0;i<wgScript.length;i++){
			var oScript = wgScript[i],oTag;
			if(wgAction.getElementById(oScript.id)) return;
			oTag = wgAction.createElement(oScript.type); oTag.id = oScript.id;
			if(oScript.type == "script"){
				oTag.src = oScript.path;
			} else if(oScript.type == "link"){
				oTag.type = 'text/css';oTag.rel = 'stylesheet';oTag.href = oScript.path; 
			}
			wgAction.head.appendChild(oTag);	
		}
		
		setTimeout(function(){
			readConfig(wgLanguage);
			processemoji(emoji);
		},timeReadCsv);
			
				
	}
	
	function getpara(){
		var url=decodeURIComponent(window.location.href).replace( /\+/g, ' ' );
		var urlStep1 = url.split("?");
		if(urlStep1.length > 1){
			var urlStep2 = urlStep1[1].split("&");
			urlStep2.forEach(function(e) {
			var temp = e.split("=");
			paramUrl[temp[0]] = temp[1]; 
			}); 
		}
		langweb  = paramUrl["ln"];
		if(langweb != null)
		{
			
			langweb = langweb.toUpperCase()
			console.log(langweb);
			wgLanguage = langweb;
		}
	}
	
	function readConfig(lang){
		console.log("lang : "+lang);
		wgLanguage = lang;
		document.getElementById("messagechat").placeholder = wgSystem[wgLanguage]["messageresponse"]["Textsent"];
		// readWgMessageClient(lang,"messageresponse");
		// readWgMessageClient(lang,"userintention");
		
		//readWgFunction();
	}
	function openForm(){
		console.log(isIE);
		if(isIE)
		{
			console.log("เข้าจากIE");
		}
		firstmessage = true;
		$("#Product").val("");
		$("#user_intent").val("");
		$("input[name=Subject]").val("");
		$("#GCTI_LanguageCode").val("");
		document.getElementById("formchat").style.display = "block";
		selecInten = false;
		$('#uploadfile').prop('disabled', true);
		$('#messagechat').prop('disabled', false);	
		$('#btn-Send').prop('disabled', false);		
		// $('#btn-emoji').prop('disabled', false);
		document.getElementById("btn-emoji").disabled = false;
		if(!$("#"+wgChatboxId).hasClass("hide")){
			return;	
		}
		 console.log(emoji);		
		document.getElementById("messagechat").placeholder = wgSystem[wgLanguage]["messageresponse"]["Textsent"];
		$("#"+wgChatboxId).removeClass("hide");
		createMessage(wgMsgMari,wgSystem[wgLanguage]["messageresponse"]["Greeting"]);
		if(wgLanguage == 'TH')
		{
			createBtnInChat(wgBtnEng);
			timeEng = setTimeout(function(){ afterSelectLanguage();}, timeoutEng);
		}
		else
		{
			 afterSelectLanguage();
		}
	}
	
	function afterSelectLanguage(){
		removeBtnInChat(wgBtnEng["id"]);
		var isWork = checkedtimeworking();
		if(!isWork && wgLanguage == "EN"){
			createMessage(wgMsgMari,wgSystem[wgLanguage]["messageresponse"]["Outofwork"]);
			$('#btn-Send').prop('disabled', true);
			$('#uploadfile').prop('disabled', true);
			document.getElementById("btn-emoji").disabled = true;
			$('#messagechat').prop('disabled', true);
			return false;
		}		
		else{
			setTimeout(function(){
				var userIntent = createUserIntention(wgSystem[wgLanguage]["userintention"]);
				displayUserIntention(wgMsgMari,userIntent);
				// createBtnInChat(wgBtnRequestChat);
				// createBtnSelect(wgBtnQ,wgBtnCancelQ,wgBtnEmail);
			},timeReadCsv);
		}
		
	}
	
	function createMessageExternal(msgFrom,msgText){
      createDateMsg();
      var liObj = document.createElement('li');
      liObj.id = "li"+document.getElementById("ul-history").childNodes.length;
      liObj.innerHTML = "</div><center><div class='message-smallbox'><div class='message-smallbox-head'>"+msgFrom+"  |  "+dateMsg+"</div><div class='message-smallbox-body'>"+msgText+"</div></div></center>";
      document.getElementById("ul-history").appendChild(liObj);     
      focusScroll();
	}
	
	
	
	function clearTimeEng(){
		clearTimeout(timeEng);
	}
	
	function closeForm(data){
		end = true;
		if(oChatStart){
			openConfirmEnd(data);
		} else{
			clearChatbox();
			document.getElementById("emoji-chat").style.display = "none";
			click=false;
		}
	}
	
	function clearChatbox(){
		$("#wgChatbox").addClass("hide");
		$("#ul-history").empty();
		clearTimeEng();
		if(internet == true)
		{
			closeConfirmEnd();
		}
		wgLanguage = "TH";
		readConfig(wgLanguage);
		isewt = false;
	}
	
	function clickemoji(){
		if(click == false){
			document.getElementById("emoji-chat").style.display = "block";
			click=true;
		}
		else{
			document.getElementById("emoji-chat").style.display = "none";
			click=false;
		}
		
	}
	
	function openConfirmEnd(data){
		$(".comfirm-end-background").removeClass("hide");
		$(".comfirm-end-box").removeClass("hide");
		console.log(data);
		if(data == "end")
		{	
			
			$('.comfirm-end-inside span').text(wgSystem[wgLanguage]["messageresponse"]["ChatEndQuestion"]);
			$('.comfirm-end-inside button[name="btn-cancel"]').text(wgSystem[wgLanguage]["messageresponse"]["btn_cancel"]);
			$('.comfirm-end-inside button[name="btn-end"]').text(wgSystem[wgLanguage]["messageresponse"]["btn_end"]);
			$('#btn-email').hide();
			$('#btn-end').show();
			//$('#btn-cancel').show();
			$('#btn-cancel').css('display', 'inline-block');
			
		}
		else {
			
			$('.comfirm-end-inside span').text(wgSystem[wgLanguage]["messageresponse"]["CancelChatEnd"]);
			$('.comfirm-end-inside button[name="btn-cancel"]').text(wgSystem[wgLanguage]["messageresponse"]["btn_cancel"]);
			$('.comfirm-end-inside button[name="btn-end"]').text(wgSystem[wgLanguage]["messageresponse"]["btn_end"]);
			$('#btn-end').show();
			$('#btn-cancel').css('display', 'inline-block');
			//$('#btn-cancel').show();
		}
		// else{
			// $('.comfirm-end-inside span').text(dataMessage["EmailChatEnd"]);	
			// $('.comfirm-end-inside button[name="btn-cancel"]').text("Cancel");
			// $('.comfirm-end-inside button[name="btn-email"]').text("Send Email");
			
		// }
		
		
	}
	
	function onMessageAlert(data){
		console.log("internet : "+internet);
		console.log("firstmessage : "+firstmessage);
		if(internet || firstmessage)
		{	$(".comfirm-end-background").removeClass("hide");
			$(".comfirm-end-box").removeClass("hide");
			$('.comfirm-end-inside span').text(data);
			$('.comfirm-end-inside button[name="btn-cancel"]').text(wgSystem[wgLanguage]["messageresponse"]["btn_ok"]);
			document.getElementById("btn-end").style.display = "none";
			document.getElementById("btn-cancel").style.display = "block";
		}
		else if(!internet)
		{
			$(".comfirm-end-background").removeClass("hide");
			$(".comfirm-end-box").removeClass("hide");
			$('.comfirm-end-inside span').text(data);
			$('.comfirm-end-inside button[name="btn-cancel"]').text(wgSystem[wgLanguage]["messageresponse"]["btn_ok"]);
			document.getElementById("btn-end").style.display = "none";
			document.getElementById("btn-cancel").style.display = "none";
		}
		//$('#btn-cancel').show();
		
	}
	
	function closeConfirmEnd(){
		$(".comfirm-end-background").addClass("hide");
		$(".comfirm-end-box").addClass("hide");
	}
	
	function createBtnReqChat(){
		var liObj = document.createElement('li');
		liObj.id = "li"+document.getElementById("ul-history").childNodes.length;
		liObj.innerHTML = "<center><button type='button' class='btn-in-chat' id='btn-reqchat' onclick='requestChat();'>Request Chat</button></center>";
		document.getElementById("ul-history").appendChild(liObj);     
		focusScroll();
	}
	
	function sendMsg(){
		
		clearTimeout(timeEng);
		removeBtnInChat(wgBtnEng["id"]);
		//afterSelectLanguage();
		var text = $('textarea[name=messagechat]').val().replace(/\n/g, "");
		$('textarea[name=messagechat]').val("");
		if(text.trim() == ""){
			return false;
		}
		setTimeout(function(){			
			if(!oChatStart){
				$("input[name=Subject]").val(text);
				 if(firstmessage == true)
				 {
					 createMessage(wgMsgCustomer,text);
					 
				 }
				 else
				 {
					
				 }
				$("#GCTI_LanguageCode").val("");
				requestChat();
			} else{
				// oChat.sendMessage(text);
				var isUrl = false;
				webSystax.forEach(function(x){
					if(text.search(x) != -1){
						isUrl = true;
						return;
					}
				});
				
				if(isUrl){
					console.log("test url http : "+text.search("http"));
					if(text.search("http://") == -1){
						text = "http://"+text;
						
					} 
						//else if(text.search("https://") == -1){
						//text = "https://"+text;
					//}
					console.log("test url : "+text);
					if(text.search(" ") < text.length)
					{
						var url = text.substring(0, text.search(" "));
						var subtext = text.substring(text.search(" "), text.length)
						console.log("test url : "+url);
						console.log("test subtext : "+subtext);
						console.log("test text url : "+text);
						
						console.log("test lenght : "+text.length);
						
						console.log("test search : "+text.search(" "));
						oChat.pushUrlChat(url);
						oChat.sendMessage(subtext);
					}
					else
					{
						oChat.pushUrlChat(text);
					}
				} else{
					
					oChat.sendMessage(text);
				}
			}
		},timeReadCsv);
		
	}
	
	function isBlankSetAnonymous(val){
		var ret = val;
		if( ret == "") ret = "Anonymous";
		return ret;
	}
	
	
	
	function selectProductService(pin,txt){
		console.log(selecInten);
		if(selecInten == false)
		{
			var v = pin.split("-");
			createMessage(wgMsgCustomer,txt);
			$("#Product").val(v[0]);
			$("#user_intent").val(v[1]);
			$("input[name=Subject]").val(txt);
			$("#GCTI_LanguageCode").val(wgLanguage);
			firstmessage = true;
			requestChat();
			selecInten = true;			
			//oChat.sendMessage(txt);
		}
		
	}
	
	function selectEmoji(pin,txt){
		// var x = document.getElementById("messagechat").val();
		// var x = $("textarea[name=messagechat]").val();	
		var x = document.getElementById("messagechat").value
		 document.getElementById("messagechat").value = x+txt;
		 
		// $("#messagechat").val(x+txt);
		// document.frmMain.messagechat.focus();		
		$("#messagechat").focus();
	}

	function requestChat(){
		$("input[name=firstName]").val(isBlankSetAnonymous($('input[name=firstName]').val()));
		$("input[name=lastName]").val(isBlankSetAnonymous($('input[name=lastName]').val()));
		var formchat = $('#formchat').serialize();
		oChat = new ChatFactory({
			baseURL: "https://galb.truecorp.co.th", 
			<!-- chatServiceName: "gms-chat", -->
			<!--baseURL: "https://172.30.181.15:8443",-->
			chatServiceName: "gms-chat",
			useCometD: false,
			verbose: true,
			debug:true,
			onStarted: onStarted,
			onEnded: onEnded,
			<!-- onFileSent: onFileSent, -->
			onMessageReceived: onMessageReceived,
			onFileReceived: onFileReceived,
			onError: onError,
			onDownloadFile:onDownloadFile,
			onDownloadFileIE:onDownloadFileIE,
			onMessageAlert:onMessageAlert
		});
		// Start the chat using the variable in form.
		oChat.startChat(formchat);
		console.log(formchat);
		createMessage(wgMsgMari,wgSystem[wgLanguage]["messageresponse"]["ChatStarted"]);
		console.log("ยังไม่ส่งข้อความแรก");
		console.log(firstmessage);
		setTimeout(function(){
			if(firstmessage == true)
		{
			console.log("เข้าข้อความแรก");
			console.log($("input[name=Subject]").val());
			oChat.sendMessage($("input[name=Subject]").val());
			
		}
		}, 2000);  
		
		// $('textarea[name=messagechat]').val($("input[name=Subject]").val());
		// console.log("test subject : "+$('textarea[name=messagechat]').val());
		// var text = $('textarea[name=messagechat]').val();
		// console.log("test text subject : "+text);
		// oChat.sendMessage(text);
		// firstmessage = true;
		// sendMsg();
		
		
	}
	
	// The Chat class will call onStarted when the chat session has been successfully created
	function onStarted() {
		oChatStart = true;
	}
	
	// The Chat class will call onEnded when the chat session has ended
	function onEnded() {
		oChatStart = false;
	}
  
  function onMessageReceived(typeFrom,typeMsg,nickname,textMsg,chatend) {
		
		var msg = "";
		
		if ( typeMsg === 'Message' || typeMsg === 'Message.Text' ) {
			var n = textMsg.search("http");
			console.log("N : "+n);
			if(n>1)
			{
				var	texth = textMsg.substring(0, n)
				var urlweb = textMsg.substring(n,textMsg.length);	
				var m = urlweb.search(" ");
				var textn = urlweb.substring(m,textMsg.length)
				console.log("textn : "+textn);
				if(m > 0)
				{
					urlweb = urlweb.substring(0, m);
					msg = ""+texth+"<a href='"+urlweb+"' target='_blank' >"+urlweb+"</a>"+textn+"";
				}
				else
				{
					urlweb = urlweb.substring(0, textMsg.length);
					msg = ""+texth+"<a href='"+urlweb+"' target='_blank' >"+urlweb+"</a>";
				}
				console.log("M : "+m);
				console.log("textMsg.length : "+textMsg.length);
				console.log("urlweb : "+urlweb);
				// msg = textt+" "+urlweb;
			}
			else if(n>=0 && n<2){
			var urlweb = textMsg.substring(n,textMsg.length);	
				var m = urlweb.search(" ");
				var textn = urlweb.substring(m,textMsg.length)
				console.log("textn : "+textn);
				if(m > 0)
				{
					urlweb = urlweb.substring(0, m);
					msg = "<a href='"+urlweb+"' target='_blank' >"+urlweb+"</a>"+textn+"";	
				}
				else
				{
					urlweb = urlweb.substring(0, textMsg.length);
					msg = "<a href='"+urlweb+"' target='_blank' >"+urlweb+"</a>";	
				}
				console.log("M : "+m);
				console.log("textMsg.length : "+textMsg.length);
				console.log("urlweb : "+urlweb); 
			}
			else{
			msg = textMsg;
			}
		} else if ( typeMsg === 'ParticipantJoined' || typeMsg === 'Notice.Joined') {
			msg = wgSystem[wgLanguage]["messageresponse"]["Joinedchat"];
			$('#uploadfile').prop('disabled', false);
		} else if ( typeMsg === 'ParticipantLeft' || typeMsg === 'Notice.Left') {
			msg = wgSystem[wgLanguage]["messageresponse"]["Leftchat"];
		} else if ( typeMsg === 'PushUrl' || typeMsg === 'PushUrl.Text' ) {
			// msg = "<a href='"+textMsg+"'>"+textMsg+"</a>";
			msg = "<a href='http://"+textMsg+"' target='_blank' >"+textMsg+"</a>";
		} else if ( typeMsg === 'Notice' || typeMsg === 'Notice.Text' ) {
			msg = textMsg;
		}
		// msg.length
		if(typeFrom === "Client" && typeMsg === "TypingStarted") return;
		if(typeFrom === "Client" && typeMsg === "TypingStopped") return;
		if(typeFrom === "Client" && msg === "read-confirm") return;
    
    if(typeFrom === "Agent" && typeMsg === "TypingStarted"){
		if(!document.getElementById('liTyping')){
			typingMessage(wgMsgAgent,wgSystem[wgLanguage]["messageresponse"]["typing"]);
		}
      return false;
    }
    
    if(typeFrom === "Agent" && typeMsg === "TypingStopped"){
		removeTyping();
		// $('#li-btn-selecter').empty();
		return false;
    }
    
		if(typeFrom === "Client"){
			if(msg == wgSystem[wgLanguage]["messageresponse"]["Joinedchat"]  )
				{
					$('#uploadfile').prop('disabled', false);
				 	return;
				}
				if(firstmessage == true)
				{
					firstmessage = false;
				}
			 else if(firstmessage == false)
				 {
					createMessage(wgMsgCustomer,msg); 
				 }
			
		} else if(typeFrom === "Agent"){
			if(msg == wgSystem[wgLanguage]["messageresponse"]["Leftchat"] && chatend == true){
				removeTyping();
				$('#btn-Send').prop('disabled', true);
				$('#uploadfile').prop('disabled', true);
				// $('#btn-emoji').prop('disabled', true);
				document.getElementById("btn-emoji").disabled = true;
				$('#messagechat').prop('disabled', true);
				createMessage(wgMsgAgent,msg);
				return;
				
			}
			if(isewt == true)
			{	console.log("isewt : "+isewt);
				console.log("เข้าewtเงื่อนไข");
				clearTimeout(timeselecter);
				if($("#li-btn-selecter")&& chanelselect == true )
				{
					document.getElementById('li-btn-selecter').parentNode.removeChild(document.getElementById('li-btn-selecter'));
					createMessage(wgMsgAgent,msg);
					isewt = false;
					chanelselect = false;
				}else if($("#li-btn-sms") && isewt && chanelselect == false){
					console.log("เข้าทุกเงื่อนไข");
					clearTimeout(SmsTime);
					document.getElementById('li-btn-sms').parentNode.removeChild(document.getElementById('li-btn-sms'));	
					createMessage(wgMsgAgent,msg);
					isewt = false;
					
				}				
			}
			
			else if(msg != wgSystem[wgLanguage]["messageresponse"]["Leftchat"] && chatend == false)
			{
				removeTyping();
				createMessage(wgMsgAgent,msg);
			}
			// $('#li-btn-selecter').empty();
			
		} else if(typeFrom === "External"){
			
			if(msg.search("VQ_")>=0)
			{	var obj= {};
				obj = msg.split(",");
				console.log("EWT : "+obj[1]);
				 if(obj[1] > ewttime)   //ewttime
				 {
					timefilter(msg);
					isewt = true;
				 }
			}else if(msg == wgSystem[wgLanguage]["messageresponse"]["Joinedchat"]){
				return;
			}else{
				if(!isewt && msg != "")
				{
					createMessage(wgMsgMariload,msg);
				}
				else
				{
					SplashMes.push(msg);
				}
			}
			
			
			
			 
		}
	}
  
	function onFileReceived(typeFrom,nickname,udata) {
		
		var msg = "";
		var filesize = (parseInt(udata["file-size"])/1024).toFixed(2);
		//message : {"from":{"nickname":"agent","participantId":2,"type":"Agent"},"index":10,"text":"00D25C4FD5580141","type":"FileUploaded","utcTime":1548735832000,"userData":{"file-document-id":"0002KaE4JJ9Y00BX","file-source":"ucs","file-upload-path":"C:\\Users\\Administrator\\Desktop\\New Text Document.txt","file-id":"00D25C4FD5580141","file-upload-type":"file-system","file-size":"438","file-name":"New Text Document.txt"}}
		msg = udata["file-name"]
			+ "<br/>"
			+ filesize+" KB"
			+ "<br/>"
			+ "<center>"
			+ "<button type='button' class='btn-in-chat-download' "
			+ "value='"+udata["file-id"]+"' "
			+ "onclick='downloadfile(this.value,\""+udata["file-name"]+"\")' "
			+ ">"+wgSystem[wgLanguage]["messageresponse"]["DownloadButton"]+"</button>"
			+ "</center>"
			;
		
		if(typeFrom === "Client"){
			createMessage(wgMsgCustomer,msg); 
		} else if(typeFrom === "Agent"){
			removeTyping();
			createMessage(wgMsgAgent,msg);
		} else if(typeFrom === "External"){
			createMessage(wgMsgMari,msg);
		}
	}
	
	function downloadfile(fileid,filename){
		oChat.downloadfileChat(fileid,filename);
	}
	
	function onDownloadFile(data,filename){
		var ev = document.createEvent("MouseEvents");
		ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		var a = document.createElement('a');
		var spt = filename.split(".");
		var blob = data;
		var url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = filename;
		a.dispatchEvent(ev);
		setTimeout(function(){
			window.URL.revokeObjectURL(url);
		}, 2000);  
		
	}
	
	function onDownloadFileIE(data,filename){
		console.log("โหลดไฟล์จากIE");
		// // var ev = document.createEvent("MouseEvents");
		// // ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		// var a = document.createElement('a');
		// var spt = filename.split(".");
		// var blob = new Blob([data],{type: wgMimeType[spt[1]]});
		// var url = window.URL.createObjectURL(blob);
		// a.href = url;
		// a.download = filename;
		// a.click();
		// console.log(url);
		// console.log(filename);
		// console.log(data);
		// // a.dispatchEvent(ev);
		// // setTimeout(function(){
		// window.URL.revokeObjectURL(url);
		// // }, 2000);  
		window.navigator.msSaveBlob(data, filename);
		
	}
	// The chat class will call onError when an error occurs for any reason
	function onError(err) {
		alert(err);
	}
	
	function endChat(){
		console.log(end);
		if(end == true)
		{
			var val={DisconnectReason:"Chat_UserEnd"};
			console.log(val);
			console.log("end : "+end);
			oChat.updateUserDataChat(val);
			end = false;
		}
		else{
			var val={DisconnectReason:"Chat_ChannelSelectorTimeout"};
			console.log(val);
			console.log("end : "+end);
			oChat.updateUserDataChat(val);
			
		}
		oChat.endChat();
		clearChatbox();
		oChatStart = false;
		wgLanguage = "TH";
		readConfig(wgLanguage);
		document.getElementById("emoji-chat").style.display = "none";
		click=false;
		// document.getElementById("wg-emoji").innerHTML=""; 
	}
	
	$(document).on('keypress','textarea[name=messagechat]',function(e) { 
		if ( e.which == 13 ) {
			
			console.log(e.which);
			e.preventDefault();sendMsg();
		} 
	});
	
	function timefilter(dataArr) {
		// createMessage(wgSelect,text); 
		// console.log(dataMessage["btn_cancel"]);
		// createBtnInChat("chselect");
		
		var obj = {};
		var x ;
		obj = dataArr.split(",");
		 if(obj[1] > 0)
		 {	
			x = obj[1]/60;
			x = Math.round(x);
			console.log(x);
			var messageewt = wgSystem[wgLanguage]["messageresponse"]["EWT"].replace("_X_",x);
			createMessage(wgMsgMari,messageewt);	
			createBtnSelect(wgBtnQ,wgBtnCancelQ,wgBtnEmail);
			
			
		 }
		// else
		// {
			// createMessage(wgMsgMari,msg);
		// }
	}
	function openemail() {
		// if(wgLanguage == "TH"){
			// window.open(email+"th");
		// }
		// else{
			// window.open(email+"en");
		// }
		// endChat();
		createEmail(wgMsgMari,wgSystem[wgLanguage]["messageresponse"]["AskSMS"]);
		
	}
	function selectq() {
		// $('#li-btn-selecter').empty();
		chanelselect = false;
		document.getElementById('li-btn-selecter').parentNode.removeChild(document.getElementById('li-btn-selecter'));
		
		// isewt = false;
		createSms(wgMsgMari,wgSystem[wgLanguage]["messageresponse"]["AskSMS"]);
		 SmsTime = setTimeout(function(){
				//document.getElementById('li6').parentNode.removeChild(document.getElementById('li6'));
				for(var j=0;j<SplashMes.length;j++){		
					createMessage(wgMsgMariload,SplashMes[j]);					
				}		
						
				clearTimeout(timeselecter);
				
			},timeSms);
	}
	
	$(document).on('keydown','textarea[name=messagechat]',function(e) { 
		if(oChatStart){
			oChat.startTypingChat();
		}
	});
	
	// $(document).on('keyup','textarea[name=messagechat]',function(e) { 
		// if(oChatStart){
			// oChat.stopTypingChat();
		// }
	// });
	
	function attach(fileup){	
		oChat.uploadfileChat(fileup);
	}
	
	function Selectewt() {
		var str = "Visit W3Schools!"; 
		var n = str.search("W3Schools");
		document.getElementById("demo").innerHTML = n;
	}
	function submitSms(){
		isewt = false;
		var smsval={SMSContactNumber:$('#sms').val().trim()};
		console.log(smsval);
		oChat.updateUserDataChat(smsval);
		document.getElementById('li-btn-sms').parentNode.removeChild(document.getElementById('li-btn-sms'));
		console.log("SplashMes : "+SplashMes.length);
		for(var j=0;j<1;j++){		//SplashMes.length
			createMessage(wgMsgMariload,SplashMes[j]);					}		
			isewt = false;		
			clearTimeout(timeselecter);
			clearTimeout(SmsTime);
	}
	
	