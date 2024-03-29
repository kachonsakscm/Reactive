var timeselecter;
var wgDateMessage;
var oAction = {
	MsgTemplate: function(message) {}
}

function createMessage(msgFrom,msgText){
	wgDateMessage = createWgDateMessage();
	var listChat  = wgAction.createElement(tagList);
	listChat.id   = tagList + wgAction.getElementById(wgUlChatId).childNodes.length;;
	
	var template = "<div class='"+msgFrom["headclass"]+"'>";
	if(msgFrom["position"] == "right"){
		template+= "	<span class='"+msgFrom["timeclass"]+"'>"+wgDateMessage+"</span>"
				+  "	<span class='"+msgFrom["headnameclass"]+"'>"+msgFrom["name"]+"</span>"
				;
	} 
	else{
		template+= "	<img src='"+msgFrom["img"]+"'>"
				+  "	<span class='"+msgFrom["headnameclass"]+"'>"+msgFrom["name"]+"</span>"
				+  "	<span class='"+msgFrom["timeclass"]+"'>"+wgDateMessage+"</span>"
				;
	}
	// else if(msgFrom["subject"] == "select"){
		// template+= "	<img src='"+msgFrom["img"]+"'>"
				// +  "	<span class='"+msgFrom["headnameclass"]+"'>"+msgFrom["name"]+"</span>"
				// +  "	<span class='"+msgFrom["timeclass"]+"'>"+wgDateMessage+"</span>"
				// +  "	<button type='button' class='quick-reply' id='btn-SmsN' onclick='submitSms();'></button>"
				// ;
	// } 
	if(msgFrom["position"] == "load")
	{
	template += "</div>"
			 + "<div class='"+msgFrom["bodyclass"]+"'>"+msgText+" "+"<img src='https://survey.truecorp.co.th/web/img/loading.gif' width='30' height='8' style='display:inline-block;'></div>"
			 ;
	}
	else
	{
	template += "</div>"
			 + "<div class='"+msgFrom["bodyclass"]+"'>"+msgText+"</div>"
			 ;	
	}
	console.log("test message text : "+msgText);
	listChat.innerHTML = template;				   
	wgAction.getElementById(wgUlChatId).appendChild(listChat);
	focusScrollwgChatbox();
	
}

$(document).on('keypress keyup','input[name=textsms]',function (e) {
		$(this).val($(this).val().replace(/[^0-9\.]/g,''));
		if ((e.which != 46 || $(this).val().indexOf('.') != -1) && (e.which < 48 || e.which > 57)) {
			e.preventDefault();
		}
		
		if($(this).val().length>9){	
		
			 // $('#btn-SmsY').prop('disabled', false);	
			document.getElementById("btn-SmsY").disabled = false;
		}
		if($(this).val().length<10){	
		
			 // $('#btn-SmsY').prop('disabled', true);
			document.getElementById("btn-SmsY").disabled = true;
			 
		}
	
    });

function createSms(msgFrom,msgText){
	wgDateMessage = createWgDateMessage();
	var listChat  = wgAction.createElement(tagList);
	listChat.id   = tagList + "-btn-sms";
	
	var template = "<div class='"+msgFrom["headclass"]+"'>";
	if(msgFrom["position"] == "right"){
		template+= "	<span class='"+msgFrom["timeclass"]+"'>"+wgDateMessage+"</span>"
				+  "	<span class='"+msgFrom["headnameclass"]+"'>"+msgFrom["name"]+"</span>"
				;
	} 
	else{
		template+= "	<img src='"+msgFrom["img"]+"'>"
				+  "	<span class='"+msgFrom["headnameclass"]+"'>"+msgFrom["name"]+"</span>"
				+  "	<span class='"+msgFrom["timeclass"]+"'>"+wgDateMessage+"</span>"
				;
	}
	template += "</div>"
			 + "<div class='messagesms'>"+msgText+"<br>"
			 + "<center><input  id='sms' type='text' name='textsms' class='txtboxsms' placeholder='"+wgSystem[wgLanguage]["messageresponse"]["AskSMSBox"]+"' title='' maxlength='10' required /><br>"
			 + "</center></div>"
			 + "<center><button type='button' class='btn-sms' id='btn-SmsN' value='cencel' onclick='closeForm(this.value);' >"+wgSystem[wgLanguage]["messageresponse"]["btn_cancel"]+"</button><button type='button' class='btn-sms' id='btn-SmsY' onclick='submitSms() ;' >"+wgSystem[wgLanguage]["messageresponse"]["SmsY"]+"</button></center>"
			 ;
	console.log("test sms : "+msgText);
	listChat.innerHTML = template;				   
	wgAction.getElementById(wgUlChatId).appendChild(listChat);
	focusScrollwgChatbox();
	document.getElementById("btn-SmsY").disabled = true;
}

function displayUserIntention(msgFrom,msgText){
	wgDateMessage = createWgDateMessage();
	var listChat  = wgAction.createElement(tagList);
	listChat.id   = tagList + wgAction.getElementById(wgUlChatId).childNodes.length;;
	
	var template = "<div class='"+msgFrom["headclass"]+"'>";
	if(msgFrom["position"] == "right"){
		template+= "	<span class='"+msgFrom["timeclass"]+"'>"+wgDateMessage+"</span>"
				+  "	<span class='"+msgFrom["headnameclass"]+"'>"+msgFrom["name"]+"</span>"
				;
	} else{
		template+= "	<img src='"+msgFrom["img"]+"'>"
				+  "	<span class='"+msgFrom["headnameclass"]+"'>"+msgFrom["name"]+"</span>"
				+  "	<span class='"+msgFrom["timeclass"]+"'>"+wgDateMessage+"</span>"
				;
	}
	
	template += msgText;
			 
	listChat.innerHTML = template;				   
	wgAction.getElementById(wgUlChatId).appendChild(listChat);
	focusScrollwgChatbox();
}

function createWgDateMessage(){
	var returnDate;
	var testtime;
	var today  = new Date();
	// returnDate = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear()+" "+ today.getHours()+":"+(today.getMinutes()<10?'0':'')+today.getMinutes();
	returnDate = ((today.getHours() < 13) ? today.getHours() : (today.getHours() - 12))+ ":" 
	+(((today.getMinutes() < 10)? "0" : "")+today.getMinutes()+" "+((today.getHours() < 12) ? "AM" : "PM"));
	testtime = ((today.getMinutes() < 10)? "0" : "");
	// console.log("testtime : "+testtime);
	return returnDate;
}

function createBtnInChat(btnObj){ 
	var listChat  = wgAction.createElement(tagList);
	listChat.id   = tagList+"-btn"+btnObj["id"];	
	var template = "<center>"
				 + "<button type='button' class='btn-in-chat' "
				 + "id='"+btnObj["id"]+"' "
				 + "value='"+btnObj["v"]+"' " 
				 + "onclick='"+btnObj["oc"]+"' "
				 + ">"+btnObj["t"]+"</button>"
				 + "</center>"
				 ;
	listChat.innerHTML = template;
	wgAction.getElementById(wgUlChatId).appendChild(listChat);     
	focusScrollwgChatbox();
}

function createBtnSelect(btnqObj,btncanqObj,btnEmObj){ 
	var listChat  = wgAction.createElement(tagDiv);
	listChat.id   = tagList+"-btn-selecter";
	
	
	
	
	
	
	var template = ""
		if(btn_Q == true)
		{		console.log(btn_Q);
				console.log(wgSystem[wgLanguage]["messageresponse"]["btn_q"]);
				btnqObj["t"] = wgSystem[wgLanguage]["messageresponse"]["btn_q"];
				template += "<div class='btn-select' "
				+ "id='"+btnqObj["id"]+"' "
				+ "value='"+btnqObj["v"]+"' " 
				+ "onclick='"+btnqObj["oc"]+"' "
				+ ">"+btnqObj["t"]+"<span class='selec' >"+" >"+" </span></div>" 
				;
		}
		if(btn_CancelQ == true){
				console.log(btn_CancelQ);
				console.log(wgSystem[wgLanguage]["messageresponse"]["btn_cancel"]);
				btncanqObj["t"] = wgSystem[wgLanguage]["messageresponse"]["btn_cancel"];
				template += "<div  class='btn-select' "
				+ "id='"+btncanqObj["id"]+"' "
				+ "value='"+btncanqObj["v"]+"' " 
				+ "onclick='"+btncanqObj["oc"]+"' "
				+ ">"+btncanqObj["t"]+"<span class='selec' >"+" >"+" </span></div>"
				;
		}
		if(btn_Email == true){
				console.log(btn_Email);
				console.log(wgSystem[wgLanguage]["messageresponse"]["btn_email"]);
				btnEmObj["t"] = wgSystem[wgLanguage]["messageresponse"]["btn_email"];
				template += "<div  class='btn-select' "
				+ "id='"+btnEmObj["id"]+"' "
				+ "value='"+btnEmObj["v"]+"' " 
				+ "onclick='"+btnEmObj["oc"]+"' "
				+ ">"+btnEmObj["t"]+"<span class='selec' >"+" >"+" </span></div>"
				;
		}
		template += "</center>";
	
	listChat.innerHTML = template;
	wgAction.getElementById(wgUlChatId).appendChild(listChat);     
	focusScrollwgChatbox();
	console.log(timeChSelect);
	timeselecter = setTimeout(function(){ endChat();}, timeChSelect);
}

function removeBtnInChat(id){
	if(wgAction.getElementById(id)){
		wgAction.getElementById(id).parentNode.removeChild(wgAction.getElementById(id));
	}
}

function focusScrollwgChatbox(){
		$("#"+wgDivChatId).animate({
			scrollTop: $("#"+wgDivChatId).prop("scrollHeight")
		}, 'slow');
}

function readWgMessageClient(lang,what){
	console.log("Lang What : "+wgSystem[lang][what]);
	wgLanguage = lang;
	console.log("what : "+what);
	$.ajax({
		type: "GET",  
		url: ""+wgSystem[lang][what],
		dataType: "text",       
		success: function(response){ 
			if(response){
				if(what == "userintention"){				
					processUserIntention(response.split(/\r\n|\n/));
					
				} else{
					processData(response.split(/\r\n|\n/));
					
				}
			}
		}   
	});
}

function readWgemoji(){
	console.log("Emoji : "+wgServer+"/"+wgConfigPath+"/emoji.txt");
	$.ajax({
		type: "GET",  
		url: ""+wgServer+"/"+wgConfigPath+"/emoji.txt",
		dataType: "text",       
		success: function(response){ 
			if(response){
				
					processemoji(response.split(/\r\n|\n/));
					// console.log(""+response.split(/\r\n|\n/));
			}
		}   
	});
}

function readWgFunction(){
	console.log("Function : "+wgServer+"/"+wgConfigPath+"/Function.txt");
	$.ajax({
		type: "GET",  
		url: ""+wgServer+"/"+wgConfigPath+"/Function.txt",
		dataType: "text",       
		success: function(response){ 
			if(response){
				
					processFunction(response.split(/\r\n|\n/));
					
			}
		}   
	});
}

function processData(dataArr){
	dataArr.forEach(function(element) {
		var temp = element.split(",");
		dataMessage[temp[0]] = temp[1]; 
	});
	// console.log(dataMessage);
	document.getElementById("messagechat").placeholder = wgSystem[wgLanguage]["messageresponse"]["Textsent"];
}

function processFunction(dataArr){
	dataArr.forEach(function(element) {
		var temp = element.split(",");
		dataFunction[temp[0]] = temp[1]; 
	});
	
}
	
function processUserIntention(dataArr){
	prodIntention = [];
	var keyParam = dataArr[0].split(",");
	var i=0;
	dataArr.forEach(function(e) {
		var temp = e.split(",");
		var obj = {};
		for(var j=0;j<keyParam.length;j++){
			obj[keyParam[j]] = temp[j];
		}
		if(i!=0){
			console.log(obj);
			prodIntention.push(obj);
		}
		i++;
	});
	 // console.log(prodIntention);
}

function processemoji(dataArr){
	prodIntentione = [];
	var keyParame ;
	if(keyParame != "")
	{
		keyParame = dataArr;
		console.log("เช็คอีโมจิ"+keyParame);
	}
	var h=0;
	
	
		var obje = [];
		
			
		for(var g=0;g<keyParame.length;g++){
			obje[keyParame[g]];
			var liObj = document.createElement('span');
			liObj.className = "emoji-option" ;
			liObj.id = "emoji-option"+g;
			//liObj.data-unicode = keyParame[g];
			liObj.styleSheets = "display:inline-block";
			liObj.innerHTML = keyParame[g];
			document.getElementById("wg-emoji").appendChild(liObj);  			
		// var liObj = document.createElement('span');
		// liObj.innerHTML = "<center><button type='button' class='btn-in-chat' id='btn-reqchat' onclick='requestChat();'>Request Chat</button></center>";
		// document.getElementById("ul-history").appendChild(liObj);   		
		}
		 
		if(h!=0){
			prodIntentione.push(obje);
		}
		h++;
	
	 
	 
	  
}

function createUserIntention(pi){
	var styleProdIntention  = "<div class='dv-generic-carousel'>"
							+ "	<div id='prev-re' class='sd sd-left'>"
							+ "	<img src='"+wgServer+"/"+wgImagePath+"/btn-left.png'>"
							//+ "		<i class='fa fa-angle-left fa-lg'></i>"
							+ "	</div>"	
							+ "	<div id='next-re'  class='sd sd-right'>"
							+ "		<img src='"+wgServer+"/"+wgImagePath+"/btn-right.png'>"
							//+ "<i class='fa fa-angle-right fa-lg'></i>"
							+ "	</div>"
							+ " <ul class='ul-gc'>"
							;
			
							var listIntent = "";
							for(var i=0;i<pi.length;i++){
								listIntent += "<li>"
											+ "	<div class='dv-thumb'> "
											+ "		<img src='"+wgServer+"/"+wgImagePath+"/"+pi[i]["picture"]+"'> "
											+ " </div> "
											+ "<div class='dv-title'>"	
											+ "	<p class='p-title'>"+pi[i]["titletext"]+"</p>";
											+ "	<p class='p-subtitle'></p>"
											+ "</div>"
											;
								for(var j=0;j<((Object.keys(pi[i]).length)-3)/2;j++){
									listIntent += "<div id='"+pi[i]["titlevalue"]+"-"+pi[i]["choicevalue"+(j+1)]+"' class='dv-button-re'>"
												+ pi[i]["choicetext"+(j+1)]
												+ "</div>"
								}
								listIntent += "</li>";
							}
							styleProdIntention += listIntent
												+ "</ul>"
												+ "<div class='bul-slide-img'>";
												for(var k=0;k<pi.length;k++){
													var act = "bulnone";
													if(k == 0)act = "bulact";
													
													styleProdIntention += "<span id='bul"+k+"'"
																	   + " class='bul-img "+act+" ' onclick='bulActive("+k+")'></span>"
												}
												styleProdIntention += "</div></div>";
	return styleProdIntention;
}



function typingMessage(msgFrom,msgText){
	wgDateMessage = createWgDateMessage();
	var listChat  = wgAction.createElement(tagList);
	listChat.id   = tagList + "Typing";
	
	var template = "<div class='"+msgFrom["headclass"]+"'>";
	if(msgFrom["position"] == "right"){
		template+= "	<span class='"+msgFrom["timeclass"]+"'>"+wgDateMessage+"</span>"
				+  "	<span class='"+msgFrom["headnameclass"]+"'>"+msgFrom["name"]+"</span>"
				;
	} else{
		template+= "	<img src='"+msgFrom["img"]+"'>"
				+  "	<span class='"+msgFrom["headnameclass"]+"'>"+msgFrom["name"]+"</span>"
				+  "	<span class='"+msgFrom["timeclass"]+"'>"+wgDateMessage+"</span>"
				;
	}
	
	template += "</div>"
			 + "<div class='"+msgFrom["bodyclass"]+"'>"+msgText+"</div>"
			 ;
			 
	listChat.innerHTML = template;				   
	wgAction.getElementById(wgUlChatId).appendChild(listChat);
	focusScrollwgChatbox();
}
  
function removeTyping(){
	if(document.getElementById('liTyping')){
		document.getElementById('liTyping').parentNode.removeChild(document.getElementById('liTyping'));
	}  
	focusScrollwgChatbox();
}

function srvTime(){
		var xmlHttp;
		try {
		//FF, Opera, Safari, Chrome
		xmlHttp = new XMLHttpRequest();
		}
		catch (err1) {
		//IE
			try {
			xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
			}
			catch (err2) {
				try {
				xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
				}
				catch (eerr3) {
					//AJAX not supported, use CPU time.
					alert("AJAX not supported");
					}
				}
			}
		xmlHttp.open('HEAD',window.location.href.toString(),false);
		xmlHttp.setRequestHeader("Content-Type", "text/html");
		xmlHttp.send('');
		return xmlHttp.getResponseHeader("Date");
		}	
	  
	function  checkedtimeworking(){
		var iswork = true;
		var servertime = srvTime();
        var today = new Date(servertime);
        var h = today.getHours();
		if(h<WorkStartEng){
			iswork = false;
			
		}else if(h==WorkStopEng){
			iswork = false;
		}
		
		return iswork;
	}
	function bulActive(n){
  
		var x = ($('.ul-gc').width()*n);
		$('.ul-gc').animate({
			scrollLeft: x
		}, 500, 'swing');
		 
		buletActive(n);
 
	}
	
	function buletActive(n){
		for(var i=0;i<$(".bul-img").length; i++){
			$("#bul"+i).attr("class", "bul-img bulnone");
		}
		$("#bul"+n).attr("class", "bul-img bulact");
		bul = n;
		console.log("bul : "+bul)
	}

function createEmail(msgFrom){
	console.log(msgFrom);
	console.log(listproduct[1]["value"]);
	wgDateMessage = createWgDateMessage();
	var subtext = $("input[name=Subject]").val();
	//var subtext = $("input[name=Subject]").val();
	var protext = $("input[id=Product]").val();
	var listChat  = wgAction.createElement(tagList);
	listChat.id   = tagList + "-btn-sms";
	
	var template = "<div class='"+msgFrom["headclass"]+"'>";
	if(msgFrom["position"] == "right"){
		template+= "	<span class='"+msgFrom["timeclass"]+"'>"+wgDateMessage+"</span>"
				+  "	<span class='"+msgFrom["headnameclass"]+"'>"+msgFrom["name"]+"</span>"
				;
	} 
	else{
		template+= "	<img src='"+msgFrom["img"]+"'>"
				+  "	<span class='"+msgFrom["headnameclass"]+"'>"+msgFrom["name"]+"</span>"
				+  "	<span class='"+msgFrom["timeclass"]+"'>"+wgDateMessage+"</span>"
				;
	}
	template += "</div>"
			 + "<div class='messagesms'><div class='exit' onclick='closeForm('email')'>X</div>"
			 
			 + "<center><span class='txtemail'>"+wgSystem[wgLanguage]["messageresponse"]["HeadEmail"]+"</span></center><br><span class='txtemail'>"+wgSystem[wgLanguage]["messageresponse"]["Email"]+"</span><br><input  id='email' type='text' name='textemail' class='txtboxemail' placeholder='"+wgSystem[wgLanguage]["messageresponse"]["AskEmailBox"]+"' title='' maxlength='10' required /><br>"
			 + "<br><span class='txtemail'>"+wgSystem[wgLanguage]["messageresponse"]["ESubject"]+"<br></span><input  id='emailsubject' type='text' name='textemailsubject' class='txtboxemail' value='"+subtext+"' title='' maxlength='10' required /><br>"
			 // + "<br><span class='txtemail'>"+wgSystem[wgLanguage]["messageresponse"]["EProduct"]+"<br></span><input  id='emailproduct' type='text' name='textemailproduct' class='txtboxemail' placeholder='"+wgSystem[wgLanguage]["messageresponse"]["AskEmailProductBox"]+"' title='' maxlength='10' required /><br><br><br>"
			 +"<br><span class='txtemail'>"+wgSystem[wgLanguage]["messageresponse"]["EProduct"]+"<br></span><select name='textemailproductsubject' class='txtboxemail'><option value=''>"+wgSystem[wgLanguage]["messageresponse"]["AskEmailServicenumber"]+"</option>";
			 for(var k=0;k<listproduct.length;k++){
				template += "<option value='"+listproduct[k]["value"]+"'>"+listproduct[k]["value"]+"</option>"
			}
			template += "</select><br>"
			 + "<br><span class='txtemail'>"+wgSystem[wgLanguage]["messageresponse"]["EServicenumber"]+"<br></span><input  id='emailservicenumber' type='text' name='textemailservicenumber' class='txtboxemail' placeholder='"+wgSystem[wgLanguage]["messageresponse"]["AskEmailServicenumber"]+"' title='' maxlength='10' required /><br>"
			 + "<input type='file' id='uploadfile1' onchange='attach(this.files);' style='display:none;'/>"
			 + "<center><div class='attachemail' onclick=$('#uploadfile1').click(); >"
			 + "<img src='"+wgServer+"/"+wgImagePath+"/attach.png' id='uploadfile' class='imgfile' style='cursor:pointer;' width='13' height='13'>&nbsp;"+wgSystem[wgLanguage]["messageresponse"]["EAttachment"]+"</div> </center>"
			 + "<span class='txtemail'>"+wgSystem[wgLanguage]["messageresponse"]["EDescriotion"]+"<br></span><textarea class='txtboxemail' "
			 +"placeholder='"+wgSystem[wgLanguage]["messageresponse"]["AskEmailDescriotion"]+"'  id='emaildescription'name='textemaildescription'rows='3'></textarea><br><br>"
			 + "</div>"
			 + "<center><button type='button' class='btn-sms' id='btn-SmsN' value='cencel' onclick='closeForm(this.value);' >"+wgSystem[wgLanguage]["messageresponse"]["btn_cancel"]+"</button><button type='button' class='btn-sms' id='btn-SmsY' onclick='sendemail() ;' >"+wgSystem[wgLanguage]["messageresponse"]["SmsY"]+"</button></center>"
			 ;
	//console.log("test sms : "+msgText);
	listChat.innerHTML = template;				   
	wgAction.getElementById(wgUlChatId).appendChild(listChat);
	focusScrollwgChatbox();
	//document.getElementById("btn-SmsY").disabled = true;
			
	
}

function createfileattach(fileattach){ 
	console.log(fileattach);
	// filelist.splice(filelist.length, 0,fileattach);
	var numfile = filelist.length;
	// var returnedTarget = Object.assign(filelist, fileattach);
	 filelist.push.apply(filelist,fileattach);
	// console.log(returnedTarget);
	console.log(filelist);
	console.log($("#fileemail").val());
	
	console.log(numfile);
	for(var i=0;i<fileattach.length;i++)
	{
		$(".messagesms").append("<div class='filemail' id='filemail["+numfile+"]'><div class='exitmail' onclick='deletefile("+numfile+")'>X</div>"+fileattach[i]["name"]+" </div>");
		numfile++;
		console.log(numfile);
	}
	focusScrollwgChatbox();
		 console.log(filelist);
		 filesendmail = [];
		for(var k=0;k<filelist.length;k++)
		{
			handleFileSelect(filelist,k);
		}
}

function refileattach(filere){ 
	
	for(var j=0;j<filere.length;j++)
	{
		$(".messagesms").append("<div class='filemail' id='filemail["+j+"]'><div class='exitmail' onclick='deletefile("+j+")'>X</div>"+filere[j]["name"]+" </div>");
	}
	focusScrollwgChatbox();
	console.log(filelist);
		// console.log(filelist[i][i]["name"]);

}

$(document).on('click touchend ','#prev-re', function(e) { console.log($('.ul-gc').width());$('.ul-gc').animate({scrollLeft: "-="+$('.ul-gc').width()}, 500, 'swing');if(bul>0){buletActive(bul-1);}});
$(document).on('click touchend','#next-re',     function() {console.log($(".bul-img").length); console.log($('.ul-gc').width());$('.ul-gc').animate({scrollLeft: "+="+$('.ul-gc').width()}, 500, 'swing');if(bul>=0 && bul < $(".bul-img").length-1 ){buletActive(bul+1);}});
$(document).on('click','.dv-button-re',function() { selectProductService(this.id,$(this).text()); });
$(document).on('click touchend','.emoji-option-re',function(e) { 
		selectEmoji(this.id,$(this).text()); 
		clickemoji();
		console.log($(this).text());	
});
$(document).on('click','#chat-history-re','.dv-button-re',function() { document.getElementById("emoji-chat-re").style.display = "none";
click=false; });
 $(document).on('click','input[name=textsms]',function (e) {
  clearTimeout(SmsTime);       
  SmsTime = setTimeout(function() { 
		document.getElementById('li-btn-sms').parentNode.removeChild(document.getElementById('li-btn-sms'));
		// for(var j=0;j<SplashMes.length;j++){		
			createMessage(wgMsgMariload,SplashMes[0]);					
		// }		
		isewt = false;		
		clearTimeout(timeselecter); }, timeSms);
	});
	 // document.getElementById("emoji-option").onclick = alert("11111");
	
	







