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
	var valcookie = {};
	
	
	window.onload = function() {	
	
		var listChat  = wgAction.createElement(tagDiv);
		listChat.id   = "listfileemail";	
		var template = ""
					 + "<input type='hidden' class='fileemail' "
					 + "id='fileemail' name='fileemail' />"
					 + ""
					 ;
		listChat.innerHTML = template;
		// console.log(wgAction.getElementById(wgUlChatId).appendChild(listChat));
		wgAction.getElementById(wgUlChatId).appendChild(listChat);   
		$(".Livere").fadeIn();		
		
		if($('.gcb-startCobrowse'))
		{
			//console.log($('.gcb-startCobrowse'));
			$('.gcb-startCobrowse').css('display', 'none');
		}
		document.getElementById("formchat").style.display = "none";
		//document.getElementById("formchat").style.display = "none";
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
		getpara();
		setTimeout(function(){
			readConfig(wgLanguage);
			processemoji(emoji);
			checkCookie();	
			submitername = $("input[id=SubmitterSourceName]").val();
		},timeReadCsv);
			
				
	}
	
	function ClearCookie() {	
			console.log("เข้าClearCookie");
		  var d = new Date();		
		  var b = new Date();		
		  d.setTime(d.getTime());		
		  b.setTime(b.getTime() );		
		  var expires = "expires=" + d.toGMTString();	
			console.log(expires);
		  var expiresb = "expires=" + b.toGMTString();		
		  console.log("expires : "+expires);		
		  console.log("expiresb : "+expiresb);		
		  document.cookie[6] = "";
		console.log("expires : "+document.cookie[6]);			  
	}		
			
	function setCookie(cname,cvalue,exdays) {		
		  var d = new Date();		
		  var b = new Date();		
		  d.setTime(d.getTime() + (exdays*24*60*60*1000));		
		  b.setTime(b.getTime() );		
		  var expires = "expires=" + d.toGMTString();		
		  var expiresb = "expires=" + b.toGMTString();		
		  console.log("expires : "+expires);		
		  console.log("expiresb : "+expiresb);		
		  document.cookie = "UserId" + "=" + UserId + "," +"ChatId" + "=" + ChatId + "," +"SecureKey" + "=" + SecureKey+ "," +"Alias" + "=" + Alias + "," +"TranscriptPosition" + "=" + TranscriptPosition + "," +"SumiterSouceName" + "=" + submitername +"," +cname + "=" + cvalue + ";" + expires + ";path=/";		
	}		
	function getCookie(cname) {		
		  var name = cname + "=";		
		  // console.log("name : "+name);		
		  var decodedCookie = decodeURIComponent(document.cookie);		
		  var ca = decodedCookie.split(';');		
		  console.log(ca);		
		  var c = "";		
		  for(var i = 0; i < ca.length; i++) {		
			  // console.log(ca[5]);		
			   // console.log("ca["+i+"] :"+ca[i].search("UserId"));		
			  if(ca[i].search("UserId")>=0)		
			  {		
				  c = ca[i];		
				  c = c.substring(0);		
			  }		
			// while (c.charAt(0) == ' ') {		
			  // c = c.substring(1);		
			  // console.log(c);		
			// }		
			if (c.indexOf(name) == 0) {		
				console.log(c.substring(name.length, c.length));		
			  return c.substring(name.length, c.length);		
			}		
	}		
		  if(c.search("UserId") >= 0)		
		  {		
			  console.log("C : "+c);		
			  return c;		
		  }else		
		  {			
			  console.log("C : ");		
			  return "";		
		  }		
		  		
		}		
	function checkCookie() {		
		  user=getCookie("username");		
		   console.log("user1 : "+user);		
				console.log("user.search : "+user.search("ChatCookie"));	
		    if (user.search("ChatCookie") >= 0) {		
				user = user.split(',');		
				console.log("usersplit : "+user);		
				for(var j=0;j<user.length; j++)		
				{		
					var mark = 0;		
					mark = user[j].search("=");		
					// console.log("mark : "+mark);		
					console.log(user[j].substring(mark+1));		
					valcookie[j]=user[j].substring(mark+1);		
				}		
						
				UserId = valcookie[0];		
				ChatId = valcookie[1] ;		
				SecureKey = valcookie[2] ;		
				Alias = valcookie[3] ;		
				TranscriptPosition = valcookie[4] ;		
				chat = "ChatCookie";	
				oChatStart = true;				
				openForm();		
			}
			else {		
				 // user = "ChatCookie";		
				 // console.log("user2 : "+user);		
				 // setCookie("username", user, 0.00105);		
			 }		
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
		console.log(paramUrl['Cobrowse']);
		console.log(paramUrl);
		if(paramUrl['Cobrowse'] != "")
		{
			
			// var channel = "";
			// channel = $("input[id=SubmitterSourceName]").val();
			if(paramUrl['Cobrowse'] == "true")
			{
				console.log("yes");
				$(".gcb-startCobrowse").click();
			}
			
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
		
		$("#messagechat").prop('name', 'messagechat-re');		
		$(".emoji-chat").prop('id', 'emoji-chat-re');		
		$(".emoji-option").prop('class', 'emoji-option-re');		
		$(".chat-history").prop("id","chat-history-re");		
		$(".span3-1").attr("onclick","closeForm('end')");		
		$("#btn-emoji").attr("onclick","clickemoji()");		
		$("#btn-end").attr("onclick","endChat()");		
		$("#btn-Send").attr("onclick","sendMsg()");		
		$("#uploadfile").attr("onchange","attach(this.files)");
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
		
		if(chat != "ChatCookie")
		{
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
			 //openemail() ;
		}else if(chat == "ChatCookie")
		{
			requestChat();
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
			document.getElementById("emoji-chat-re").style.display = "none";
			$("#messagechat").prop('name', 'messagechat');		
			$(".emoji-option-re").prop('class', 'emoji-option');		
			$("#emoji-chat-re").prop('id', 'emoji-chat');
			click=false;
			clearTimeout(timeEng);
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
			document.getElementById("emoji-chat-re").style.display = "block";
			click=true;
		}
		else{
			document.getElementById("emoji-chat-re").style.display = "none";
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
		else if(data == "email"){
			$('.comfirm-end-inside span').text(dataMessage["EmailChatEnd"]);	
			$('.comfirm-end-inside button[name="btn-cancel"]').text("Cancel");
			$('.comfirm-end-inside button[name="btn-email"]').text("Send Email");
			
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
		var text = $('textarea[name=messagechat-re]').val().replace(/\n/g, "");
		$('textarea[name=messagechat-re]').val("");
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
					oChat.sendMessage(text);
			}
		},timeReadCsv);
		
	}
	
	function isBlankSetAnonymous(val){
		var ret = val;
		if( ret == "") ret = "Anonymous";
		return ret;
	}
	
	
	
	function selectProductService(pin,txt){
		console.log(pin);
		console.log(txt);
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
		var x = $("textarea[name=messagechat-re]").val();	
		// var x = document.getElementById("messagechat").value
		 // document.getElementById("messagechat").value = x+txt;
		  $("textarea[name=messagechat-re]").val(x+txt);
		// $("#messagechat").val(x+txt);
		// document.frmMain.messagechat.focus();		
		$("#messagechat").focus();
	}

	function requestChat(){
		if(chat != "ChatCookie")
		{
			$("input[name=firstName]").val(isBlankSetAnonymous($('input[name=firstName]').val()));
			$("input[name=lastName]").val(isBlankSetAnonymous($('input[name=lastName]').val()));
			$("input[id=SubmitterSourceName]").val(submitername);
			var formchat = $('#formchat').serialize();
			oChat = new ChatFactory({
				baseURL: "https://galb.truecorp.co.th",   //Production URL
				<!--baseURL: "https://galb-dev.truecorp.co.th",-->	//DEV URL
				<!--baseURL: "https://172.16.56.134:8443",-->	//UAT URL
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
		}else if(chat == "ChatCookie")
		{
			console.log("มันเข้าcookieนะ");
			var formchat = "ChatCookie";
			oChat = new ChatFactory({
				baseURL: "https://galb.truecorp.co.th", 
				<!--baseURL: "https://172.30.181.15:8443",-->	//DEV URL
				<!--baseURL: "https://172.16.56.134:8443",-->	//UAT URL
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
		}
		// $('textarea[name=messagechat-re]').val($("input[name=Subject]").val());
		// console.log("test subject : "+$('textarea[name=messagechat-re]').val());
		// var text = $('textarea[name=messagechat-re]').val();
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
		console.log(typeFrom);
		console.log(typeMsg);
		console.log(nickname);
		console.log(textMsg);
		console.log(chatend);
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
			if($('.gcb-startCobrowse'))
		{
			$('.gcb-startCobrowse').css('display', 'block');
		}
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
			console.log("เอเจ้น");
			if(msg == wgSystem[wgLanguage]["messageresponse"]["Leftchat"] || chatend == true){
				console.log("เข้าออกจากระบบ");
				removeTyping();
				$('#btn-Send').prop('disabled', true);
				$('#uploadfile').prop('disabled', true);
				// $('#btn-emoji').prop('disabled', true);
				document.getElementById("btn-emoji").disabled = true;
				$('#messagechat').prop('disabled', true);
				createMessage(wgMsgAgent,msg);
				// ClearCookie();
				setCookie("username", user, 0.00001);
				return;
				
			}
			if(isewt == true)
			{	console.log("isewt : "+isewt);
				console.log("เข้าewtเงื่อนไข");
				clearTimeout(timeselecter);
				if(document.getElementById('li-btn-selecter') != null && chanelselect == true )
				{
					document.getElementById('li-btn-selecter').parentNode.removeChild(document.getElementById('li-btn-selecter'));
					createMessage(wgMsgAgent,msg);
					isewt = false;
					chanelselect = false;
				}else if($("#li-btn-sms") && isewt && chanelselect == false){
					console.log("เข้าทุกเงื่อนไข");
					clearTimeout(SmsTime);
					if(document.getElementById('li-btn-sms') != null){
					document.getElementById('li-btn-sms').parentNode.removeChild(document.getElementById('li-btn-sms'));	
					}
					createMessage(wgMsgAgent,msg);
					isewt = false;
					
				}				
			}
			
			else if(msg != wgSystem[wgLanguage]["messageresponse"]["Leftchat"] && chatend == false)
			{
				console.log("เคสปกติ");
				removeTyping();
				createMessage(wgMsgAgent,msg);
			}
			// $('#li-btn-selecter').empty();
			
		} else if(typeFrom == "External"){
			
			if(msg.search("VQ_")>=0)
			{	var obj= {};
				var obja ={};
				obj = msg.split(",");
				
				console.log("EWT : "+obj[1]);
				 if(obj[1] > ewttime)   //ewttime
				 {
					timefilter(msg);
					isewt = true;
				 }
				obja = msg.split("_");
				$("#Product").val(obja[3]);
				$("#user_intent").val(obja[4]);
				console.log("obj : "+obj);
			}else if(msg == wgSystem[wgLanguage]["messageresponse"]["Joinedchat"]){
				return;
			}else{
				if(!isewt && msg != "")
				{
					createMessage(wgMsgMariload,msg);
				}
				else
				{	
					console.log("msg : "+msg);
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
		// ClearCookie();
		
		oChatStart = false;
		wgLanguage = "TH";
		readConfig(wgLanguage);
		document.getElementById("emoji-chat-re").style.display = "none";
		click=false;
		$("#uploadfile1").attr("onchange","attach(this.files)");	
		$("#messagechat").prop('name', 'messagechat');		
		$(".emoji-option-re").prop('class', 'emoji-option');		
		$("#emoji-chat-re").prop('id', 'emoji-chat');
		// document.getElementById("wg-emoji").innerHTML=""; 
		if($('.gcb-startCobrowse'))
		{
			$('.gcb-startCobrowse').css('display', 'none');
		}
		setCookie("username", user, 0.00001);
		
	}
	
	$(document).on('keypress','textarea[name=messagechat-re]',function(e) { 
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
		createEmail(wgMsgMari,wgSystem[wgLanguage]["messageresponse"]["AskSMS"]);
		$("#uploadfile1").attr("onchange","attachemail(this.files)");	
		$("#uploadfile1").attr("multiple","multiple");	
		
	}
	function selectq() {
		// $('#li-btn-selecter').empty();
		chanelselect = false;
		document.getElementById('li-btn-selecter').parentNode.removeChild(document.getElementById('li-btn-selecter'));
		
		// isewt = false;
		createSms(wgMsgMari,wgSystem[wgLanguage]["messageresponse"]["AskSMS"]);
		 SmsTime = setTimeout(function(){
				document.getElementById('li-btn-sms').parentNode.removeChild(document.getElementById('li-btn-sms'));
				// for(var j=0;j<SplashMes.length;j++){		
					createMessage(wgMsgMariload,SplashMes[0]);					
				// }		
						
				clearTimeout(timeselecter);
				
			},timeSms);
	}
	
	$(document).on('keydown','textarea[name=messagechat-re]',function(e) { 
		if(oChatStart){
			oChat.startTypingChat();
		}
	});
	
	// $(document).on('keyup','textarea[name=messagechat-re]',function(e) { 
		// if(oChatStart){
			// oChat.stopTypingChat();
		// }
	// });
	
	function attach(fileup){	
	
		oChat.uploadfileChat(fileup);
	}
	function attachemail(filemail){	  
		checkfileemail(filemail);
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
	
	function deletefile(numfile){
		// filelist.pop.apply(filelist,fileattach);
		if(filelist != null)
		{
			for(var j=0;j<filelist.length;j++)
			{
				document.getElementById('filemail['+j+']').parentNode.removeChild(document.getElementById('filemail['+j+']'));	
			}
		}
		filesize = filesize-parseInt(filelist[numfile]["size"]);
		console.log(filesize);
		console.log(parseInt(filelist[numfile]["size"]));
		filelist.splice(numfile, 1);
		refileattach(filelist);
	}
	
	function handleFileSelect(evt,num) {
		console.log(evt[0]["name"]);
	  var file = [];


		  var f = evt[num]; // FileList object
		  var reader = new FileReader();
		  // Closure to capture the file information.
		  reader.onload = (function(theFile) {
			return function(e) {
			  var binaryData = e.target.result;
			  //Converting Binary Data to base 64
			  var base64String = window.btoa(binaryData);
			  // file["fileName"] = evt[k]["name"];
			  // file["fileBase64"] = base64String;
			  // filesendmail[k].fileName = "Pae";
			  // filesendmail[k].fileBase64 = base64String;
			  filesendmail.push({"fileName": evt[num]['name'],"fileBase64":base64String});
			  console.log("fileName: "+evt[num]['name']+",fileBase64:"+base64String);
			  //showing file converted to base64
			  // document.getElementById('fileemail').value = base64String;
			  
			  //alert('File converted to base64 successfuly!\nCheck in Textarea');
			};
		  })(f);
		  // Read in the image file as a data URL.
		  
		  reader.readAsBinaryString(f);
	  // }
	  // filesendmail.push(file);
	  console.log(filesendmail);

	}
	
	function checkfileemail(fmail){	 
		var istypeFile = false;
		var size = 0;
		for(var l=0;l<fmail.length;l++)
		{
			var name = fmail[l]["name"];
			size += parseInt(fmail[l]["size"]);
			var ckname = fmail[l]["name"].search(/\./);	
			
			var ck1name = name.substring(ckname+1, name.length);
			
			console.log(fmail[l]["name"]);
			console.log(ckname);
			console.log(ck1name);
			
				typefile.forEach(function(x){
					console.log(x);
					if(ck1name.search(x) != -1){
						istypeFile = true;
						return;
					}
				});
				
		}
		console.log(filesize);
		console.log(size);
		if(istypeFile && size <= filesizemax)
		{	
			filesize += size;
			console.log(filesize);
			createfileattach(fmail);
		}else if(!istypeFile)
		{
			onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-File-Types"]);
		}else if(size > filesizemax)
		{
			
			console.log(filesize);
			onMessageAlert(wgSystem[wgLanguage]["messageresponse"]["Error-Max-Total-Size"]);
		}
				
				
		
	}
	
	function sendemail(){
		var oMail = JSON.stringify({
		// var oMail = new ChatFactory({
		"emailDetail": {
		"email": "pui.numbernine@gmail.com",
		"subject": "test-mail ทดสอบ",
		"product":"",
		"serviceNo":"",
		"description":"test mail test mail ทดสอบ",
		"attachFileDetail" : filesendmail
			}
		});
			console.log(oMail);
			console.log(filelist);
			console.log(filesendmail);
	}
	