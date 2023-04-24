function communicate() {
	let value1 = document.getElementsByClassName('form-control')[0]
	alert(value1.value)
	$.ajax({
		url: "trying",
		type: "GET",
		data: {
			message: $("#form-control").val()
		},
		contentType: "application/x-www-for	m-urlencoded; charset=UTF-8",
		dataType: "text",
		success: function (responseData) {
			let inputArea = document.getElementsByClassName('form-control')[0];
			let showArea = document.getElementsByClassName("chat-box")[0];
			let submitButton = document.getElementsByClassName('submitBtn')[0];

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
			chatText.innerHTML = responseData;

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

			submitButton.disabled = true;
		},
		error: function () {
			alert("에러");
		}
	});
}