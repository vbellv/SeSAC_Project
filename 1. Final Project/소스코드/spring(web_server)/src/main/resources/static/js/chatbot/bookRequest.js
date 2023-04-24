/**
 * 
 */
function borrowbook(borrowable, status, userID, search_bcode, libraryName, button) {
	var showArea = $(".chat-messages");

	var date = new Date();
	var hour = checkTime(date.getHours());
	var min = checkTime(date.getMinutes());

	$.ajax({
		url: "/rentRequest",
		type: "POST",
		data: {
			status: status,
			lib_book_cd: search_bcode,
			userID: userID,
			libraryName: libraryName
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "text",
		success: function(responseData) {
			if (borrowable == 0) {
				showArea.append(`
			<div class="chat-message-left pb-4">
				<div>
					<img src="static/images/chatbot/SeSAC_Chatbot_Image.png" class="rounded-circle mr-1" width="40" height="40">
					<div class="text-muted small text-nowrap mt-2">
						
					</div>
				</div>
					<div class="flex-shrink-1 bg-light rounded py-2 px-3 mㅣ-3">
						<div class="font-weight-bold mb-1">
							책GPT
						</div>
							대여가 완료되었습니다.
					</div>
			</div>
		`);
			} else {
				showArea.append(`
			<div class="chat-message-left pb-4">
				<div>
					<img src="static/images/chatbot/SeSAC_Chatbot_Image.png" class="rounded-circle mr-1" width="40" height="40">
					<div class="text-muted small text-nowrap mt-2">
						${hour}:${min}
					</div>
				</div>
					<div class="flex-shrink-1 bg-light rounded py-2 px-3 mㅣ-3">
						<div class="font-weight-bold mb-1">
							책GPT
						</div>
							알림신청이 완료되었습니다.
					</div>
			</div>
		`);
			}

			button.disabled = true;
		},
		error(jqXHR, textStatus, errorThrown) {
			alert("로그인 해 주세요");
			$(location).attr('href', '/login');
		}
	});
}