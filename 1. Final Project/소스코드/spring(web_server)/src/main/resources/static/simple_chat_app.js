function checkEntry() {
	let inputArea = document.getElementsByClassName('form-control')[0];
	let submitButton = document.getElementsByClassName('submitBtn')[0];

	if (inputArea.value === "") {
		submitButton.disabled = true;
	} else {
		submitButton.disabled = false;

		if (window.event.keyCode == 13 && !window.event.shiftKey) {
			sendMessage();
		}
	}
}

function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}

	return i;
}

/**
 * 
 * 사용자가 보내는 메시지를 추가해 주는 함수
 */
function sendMessage() {
	let inputArea = document.getElementsByClassName('form-control')[0];
	let showArea = document.getElementsByClassName("chat-box")[0];
	let submitButton = document.getElementsByClassName('submitBtn')[0];

	/* 전체 */
	var messageBox = document.createElement("li");
	messageBox.setAttribute('class', 'chat-right');

	/* 아바타 */
	var chatAvatar = document.createElement("div");

	// 아이콘 이미지
	let iconImage = document.createElement("img");
	iconImage.setAttribute('src', '/static/img/EasterEgg/original.png')
	chatAvatar.appendChild(iconImage);

	// 사용자 이름
	var chatName = document.createElement("div");
	chatName.setAttribute('class', 'chat-name');
	chatName.innerHTML = "사용자";
	chatAvatar.appendChild(chatName);

	/* 본문 */
	var chatText = document.createElement("div");
	chatText.setAttribute('class', 'chat-text');
	chatText.setAttribute('style', 'white-space: pre-wrap;')
	inputValue = inputArea.value
	chatText.innerHTML = inputValue;

	/* 현재 시간 */
	let date = new Date();
	var chatHour = document.createElement("div");
	chatHour.setAttribute('class', 'chat-hour');
	chatHour.innerHTML = checkTime(date.getHours()) + ":" + checkTime(date.getMinutes());

	/* 조합 */
	messageBox.appendChild(chatHour);
	messageBox.appendChild(chatText);
	messageBox.appendChild(chatAvatar);

	/* 화면에 출력 */
	showArea.appendChild(messageBox);

	inputArea.value = '';

	var chatContainer = document.getElementsByClassName('chat-container')[0];
	chatContainer.scrollTop = chatContainer.scrollHeight;

	submitButton.disabled = true;

	communicate(inputValue)
}

function doSomething(search_bcode) {
	alert();
}

function communicate(messages) {
	let inputArea = document.getElementsByClassName('form-control')[0];
	let showArea = document.getElementsByClassName("chat-box")[0];
	let submitButton = document.getElementsByClassName('submitBtn')[0];

	var messageBox = document.createElement("li");
	messageBox.setAttribute('class', 'chat-left');
	messageBox.setAttribute('id', 'loading');

	var chatAvatar = document.createElement("div");

	let iconImage = document.createElement("img");
	iconImage.setAttribute('src', '/static/chatbot.png')
	chatAvatar.appendChild(iconImage);

	var chatName = document.createElement("div");
	chatName.setAttribute('class', 'chat-name');
	chatName.innerHTML = "새싹봇";
	chatAvatar.appendChild(chatName);

	var chatText = document.createElement("div");
	chatText.setAttribute('class', 'chat-text');
	chatText.setAttribute('style', 'white-space: pre-wrap;')

	var spinnerDiv = document.createElement("div");
	spinnerDiv.setAttribute('class', 'pt-5');

	var role = document.createElement("div");
	role.setAttribute('class', 'spinner-border text-primary');
	role.setAttribute('role', 'status');

	spinnerDiv.appendChild(role);
	chatText.appendChild(spinnerDiv);

	let date = new Date();
	var chatHour = document.createElement("div");
	chatHour.setAttribute('class', 'chat-hour');
	chatHour.innerHTML = checkTime(date.getHours()) + ":" + checkTime(date.getMinutes());

	messageBox.appendChild(chatAvatar);
	messageBox.appendChild(chatText);
	messageBox.appendChild(chatHour);

	showArea.appendChild(messageBox);

	inputArea.value = '';

	var chatContainer = document.getElementsByClassName('chat-container')[0];
	chatContainer.scrollTop = chatContainer.scrollHeight;

	$.ajax({
		url: "http://127.0.0.1:8000/",
		type: "GET",
		data: {
			msg: messages
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "JSON",
		success: function(responseData) {
			var loading = document.getElementById('loading');
			loading.remove();
			submitButton.disabled = true;
			
			if (responseData["response"] != null) {
				responseData["response"].forEach((msg) => {
					alert("asd");
					
					/* 전체 */
					var messageBox = document.createElement("li");
					messageBox.setAttribute('class', 'chat-left');

					/* 아바타 */
					var chatAvatar = document.createElement("div");

					// 아이콘 이미지
					let iconImage = document.createElement("img");
					iconImage.setAttribute('src', '/static/chatbot.png')
					chatAvatar.appendChild(iconImage);
					
					// 사용자 이름
					var chatName = document.createElement("div");
					chatName.setAttribute('class', 'chat-name');
					chatName.innerHTML = "새싹봇";
					chatAvatar.appendChild(chatName);

					/* 본문 */
					var chatText = document.createElement("div");
					chatText.setAttribute('class', 'chat-text');
					chatText.setAttribute('style', 'white-space: pre-wrap;')
					chatText.innerHTML = msg.replaceAll("\\n", '<br>');

					/* 현재 시간 */
					let date = new Date();
					var chatHour = document.createElement("div");
					chatHour.setAttribute('class', 'chat-hour');
					chatHour.innerHTML = checkTime(date.getHours()) + ":" + checkTime(date.getMinutes());

					messageBox.appendChild(chatAvatar);
					messageBox.appendChild(chatText);
					messageBox.appendChild(chatHour);

					showArea.appendChild(messageBox);

					inputArea.value = '';

					var chatContainer = document.getElementsByClassName('chat-container')[0];
					chatContainer.scrollTop = chatContainer.scrollHeight;
				});
			}
			else {
				/* 전체 */
				var messageBox = document.createElement("li");
				messageBox.setAttribute('class', 'chat-left');

				/* 아바타 */
				var chatAvatar = document.createElement("div");

				// 아이콘 이미지
				let iconImage = document.createElement("img");
				iconImage.setAttribute('src', '/static/chatbot.png')
				chatAvatar.appendChild(iconImage);

				// 사용자 이름
				var chatName = document.createElement("div");
				chatName.setAttribute('class', 'chat-name');
				chatName.innerHTML = "새싹봇";
				chatAvatar.appendChild(chatName);

				/* 본문 */
				// 전체 태그
				var chatText = document.createElement('div');
				chatText.setAttribute("class", "chat-text");
				
				
				// 껍질들
				var content = document.createElement("div");
				content.setAttribute("class", "content");
				content.setAttribute("style", "width: 500px");
				
				var container = document.createElement("div");
				container.setAttribute("class", "container")
				
				var item = document.createElement("div");
				item.setAttribute("class", "owl-carousel slide-one-item");
				
				var step;
				
				console.log(responseData["borrowable"]);
				for (step = 0; step < responseData["b_name"].length; step++) {
					var outer_div = document.createElement("div");
					outer_div.setAttribute("class", "d-md-flex testimony-29101 align-items-stretch");
					
					var image = document.createElement("img");
					image.setAttribute('src', responseData["imgURL"][step]);
					image.setAttribute("style", "width:100%; height: 100%")
					
					var text = document.createElement("div");
					text.setAttribute("class", "text");
					
					var quote = document.createElement("blockquote")
					
					var p = document.createElement("p")
					p.innerHTML = responseData["b_name"][step];
					
					var inner_div = document.createElement("div");
					inner_div.setAttribute("class", "author")
					inner_div.innerHTML = responseData["w_name"][step]
					
					var confirmButton = document.createElement("button");
					confirmButton.setAttribute("style", "width: 20;");

					if (responseData["borrowable"][step] == 0) {
						confirmButton.innerHTML = '대여하기';
						confirmButton.setAttribute('onclick', 'doSomething(' + responseData["search_bcode"][step] + ')');
					} else {
						confirmButton.innerHTML = '반납예정알림';
					}
					
					// 조합
					quote.appendChild(p);
					quote.appendChild(inner_div);
					
					text.appendChild(quote);
					text.appendChild(confirmButton);
					
					outer_div.appendChild(image);
					outer_div.appendChild(text);
					
					item.appendChild(outer_div);
				}
				
				container.appendChild(item);
				content.appendChild(container);
				chatText.appendChild(content);
				
				/* 현재 시간 */
				let date = new Date();
				var chatHour = document.createElement("div");
				chatHour.setAttribute('class', 'chat-hour');
				chatHour.innerHTML = checkTime(date.getHours()) + ":" + checkTime(date.getMinutes());

				messageBox.appendChild(chatAvatar);
				messageBox.appendChild(chatText);
				messageBox.appendChild(chatHour);

				showArea.appendChild(messageBox);

				inputArea.value = '';

				$.getScript('static/js/popper.min.js');
				$.getScript('static/js/owl.carousel.min.js');
				$.getScript('static/js/main.js');
				
				var chatContainer = document.getElementsByClassName('chat-container')[0];
				chatContainer.scrollTop = chatContainer.scrollHeight;
			};
		},
		error: function() {
			alert("에러");
		}
	});
}

$(function() {
	function getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);

				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}

	var csrftoken = getCookie('csrftoken');

	function csrfSafeMethod(method) {
		return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}
	function sameOrigin(url) {
		var protocol = document.location.protocol;
		var sr_origin = '//' + host;
		var origin = protocol + sr_origin;
		return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
			(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
			!(/^(\/\/|http:|https:).*/.test(url));
	}

	$.ajaxSetup({
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});

});