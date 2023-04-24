/**
 * 현재 시간 (시, 분)을 입력받아 24시 형식으로 변환하는 함수
 * 
 * @param {Date} CurrentTime 현재 시간
 * @returns 현재 시간을 24시 형식으로 변경한 뒤 반환
 */
function checkTime(CurrentTime) {
	if (CurrentTime < 10) {
		CurrentTime = "0" + CurrentTime;
	}

	return CurrentTime;
}

/**
 * 메시지 입력 칸의 문자열 유무를 기준으로 전송 버튼 활성화/비활성화
 */
$(function() {
	const messageBox = $("#messageBox");
	const sendButton = $("#sendButton");

	messageBox.on("input", function() {
		sendButton.prop("disabled", !$(this).val());
	});

	messageBox.on("keydown", function(event) {
		if (event.key === "Enter") {
			event.preventDefault();
			sendButton.click();
			sendButton.prop("disabled", true);
		}
	});
});

/**
 * 사용자가 입력한 문자를 화면에 출력.
 */
function enterUserMessage() {
	let inputArea = $(".form-control");
	const showArea = $(".chat-messages");

	const date = new Date();
	const hour = checkTime(date.getHours());
	const min = checkTime(date.getMinutes());

	if (userID == null) {
		userID = "익명";
	}

	const userMessage = `
	    <div class="chat-message-right pb-4">
	    	<div>
	    		<img src="static/images/user.png" class="rounded-circle mr-1" width="40" height="40">
	    		<div class="text-muted small text-nowrap mt-2">${hour}:${min}</div>
	    	</div>
	    	<div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
	    		<div class="font-weight-bold mb-1">${userID}</div>
	    			${inputArea.val()}
	    	</div>
	    </div>
	  	`;

	showArea.append(userMessage);
	sendMessageRequestToFlask(inputArea.val());

	inputArea.val("");
}

/**
 * 의도를 버튼으로도 부여할 수 있게 하기 위한 함수.
 */
var intent = -1;
var outputMsg = "";

function setIntent(userInputIntent) {
	intent = userInputIntent;

	var showArea = $(".chat-messages");

	if (userInputIntent === -1) {
		outputMsg = ""
	}
	if (userInputIntent === 0) {
		outputMsg = "검색할 내용을 입력해주세요."
	}
	if (userInputIntent === 1) {
		outputMsg = "추천받고 싶은 내용을 입력해주세요."
	}
	if (userInputIntent === 2) {
		outputMsg = "문의받고 싶은 내용을 입력해주세요."
	}

	showArea.append(`
		<div class="chat-message-left pb-4">
				<div>
					<img src="static/images/chatbot/SeSAC_Chatbot_Image.png" class="rounded-circle mr-1"
						width="40" height="40">
				</div>
				<div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3" style="width: 65%">
					<div class="font-weight-bold mb-1">책GPT</div>
					${outputMsg}
				</div>
		</div>
	`);
}


/**
 * 플라스크 웹 서버(챗봇 모델)로 통신.
 */
function sendMessageRequestToFlask(messages) {
	var showArea = $(".chat-messages");

	showArea.append(`
	<div class="chat-message-left pb-4 loading">
		<img src="static/images/chatbot/SeSAC_Chatbot_Image.png" class="rounded-circle mr-1" width="40" height="40">
			<div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
					<div>
						<div class="typing typing-1"></div>
						<div class="typing typing-2"></div>
						<div class="typing typing-3"></div>
					</div>
			</div>
	</div>
	`);

	$.ajax({
		// URL은 플라스크의 IP 주소에 맞춰서 변동 바람.
		url: "http://127.0.0.1:8000/chatbot",
		type: "POST",
		data: JSON.stringify({
			user_message: messages,
			intent: intent
		}),
		contentType: "application/json",
		dataType: "JSON",
		crossDomain: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		xhrFields: {
			withCredentials: true
		},
		success: function(responseData) {
			var date = new Date();
			var hour = checkTime(date.getHours());
			var min = checkTime(date.getMinutes());

			const intents = responseData.chatbotIntent;

			switch (intents) {
				case 0:
					showArea.append(`
					<div class="chat-message-left pb-4">
						<div>
							<img src="static/images/chatbot/SeSAC_Chatbot_Image.png" class="rounded-circle mr-1" width="40" height="40">
							<div class="text-muted small text-nowrap mt-2">${hour}:${min}</div>
						</div>
						<div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3" style="width: 65%">
							<div class="font-weight-bold mb-1">책GPT</div>
							${responseData.response[0]}<br>
							총 <font style="color: red;">${responseData["bookTitle"].length}</font>개의 검색 결과가 있습니다.
							<section class="ftco-section">
								<div class="container" style="height: 65%">
									<div class="row" style="width: 100%">
										<div class="col-md-8">
											<div class="featured-carousel owl-carousel" style="height: 80%">
											</div>
										</div>
									</div>
								</div>
							</section>
			      		</div>
			      		</div>
					</div>
					`);

					var i;

					for (i = 0; i < responseData["bookTitle"].length; i++) {
						const b_name = responseData["bookTitle"][i];
						const w_name = responseData["bookAuthor"][i];
						const search_bcode = responseData["bookCode"][i];
						const lib_book_cd = responseData["lib_book_cd"][i];
						const borrowable = responseData["bookAvailableForRent"][i];
						const intro = responseData["bookIntro"][i];
						const imgURL = responseData["bookImg"][i];
						const library_nm = responseData["libraryName"][i];

						let buttonDescription;
						let buttonFunction;

						if (borrowable == 0) {
							buttonDescription = "대출신청";
							console.log(library_nm);
							buttonFunction = `borrowbook(${borrowable}, 0, "${userID}", "${lib_book_cd}", "${library_nm}", this)`;
						}

						if (borrowable == 1) {
							buttonDescription = "반납알림";
							buttonFunction = `borrowbook(${borrowable}, 1, "${userID}", "${search_bcode}", "${library_nm}", this)`;
						}

						$(".featured-carousel").last().append(`
						<div class="item" style="justify-content: center; display: flex; text-align: center;">
							<div class="container" style="width: 100%">
								<div class="main">
									<ul id="bk-list" class="bk-list clearfix">
										<li>
											<div class="bk-book book-1 bk-bookdefault">
												<div class="bk-front">
													<div class="bk-cover-back"></div>
													<div class="bk-cover"
														style="background-image: url(${imgURL});"></div>
												</div>
												<div class="bk-page">
													<div class="bk-content bk-content-current">
														<p>
															${intro}
														</p>
													</div>
												</div>
												<div class="bk-back">
													<p>
														제목: ${b_name} <br> 저자: ${w_name}
													</p>
												</div>
												<div class="bk-right"></div>
												<div class="bk-left">
													<h2>
														<span>${w_name}</span>
													</h2>
												</div>
												<div class="bk-top"></div>
												<div class="bk-bottom"></div>
											</div>
											<div class="bk-info">
												<button class="bk-bookback">도서정보</button>
												<button class="bk-select" style="background-color: #000080;">${buttonDescription}</button>
												<button class="bk-bookview">소개글</button>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>e
						`);

						$(".bk-select").last().attr("onclick", buttonFunction);

						if (library_nm === "자양한강") {
							$(".bk-back").last().append(`<span class="badge bg-primary" style="color: white">${library_nm}</span>`);
						}
						if (library_nm === "합정역") {
							$(".bk-back").last().append(`<span class="badge bg-success" style="color: white">${library_nm}</span>`);
						}
						if (library_nm === "광진정보") {
							$(".bk-back").last().append(`<span class="badge bg-warning" style="color: white">${library_nm}</span>`);
						}
						if (library_nm === "군자역") {
							$(".bk-back").last().append(`<span class="badge bg-danger" style="color: white">${library_nm}</span>`);
						}
					}

					$(".mb-1").last().append(`
					<script src="static/js/book/books1.js"></script>
						<script>
							$(function() {
								Books.init();
							});
						</script>
					`)

					intent = -1;

					break;

				case 1:
					showArea.append(`
					<div class="chat-message-left pb-4">
						<div>
							<img src="static/images/chatbot/SeSAC_Chatbot_Image.png" class="rounded-circle mr-1" width="40" height="40">
							<div class="text-muted small text-nowrap mt-2">${hour}:${min}</div>
						</div>
						<div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3" style="width: 65%">
							<div class="font-weight-bold mb-1">책GPT</div>
							${responseData.response[3]}<br>
							총 <font style="color: red;">${responseData["bookTitle"].length}</font>개의 검색 결과가 있습니다.
							<section class="ftco-section">
								<div class="container" style="height: 65%">
									<div class="row" style="width: 100%">
										<div class="col-md-8">
											<div class="featured-carousel owl-carousel" style="height: 80%">
											</div>
										</div>
									</div>
								</div>
							</section>
			      		</div>
			      		</div>
					</div>
					`);

					var i;

					for (i = 0; i < responseData["bookTitle"].length; i++) {
						const b_name = responseData["bookTitle"][i];
						const w_name = responseData["bookAuthor"][i];
						const library_name = responseData["libraryName"][i]
						const intro = responseData["bookIntro"][i];
						const imgURL = responseData["bookImg"][i];

						$(".featured-carousel").last().append(`
						<div class="item" style="justify-content: center; display: flex; text-align: center;">
							<div class="container" style="width: 100%">
								<div class="main">
									<ul id="bk-list" class="bk-list clearfix">
										<li>
											<div class="bk-book book-1 bk-bookdefault">
												<div class="bk-front">
													<div class="bk-cover-back"></div>
													<div class="bk-cover"
														style="background-image: url(${imgURL});"></div>
												</div>
												<div class="bk-page">
													<div class="bk-content bk-content-current">
														<p>
															${intro}
														</p>
													</div>
												</div>
												<div class="bk-back">
													<p class=".bk-back-p">
														제목: ${b_name} <br> 저자: ${w_name} <br>
													</p>
												</div>
												<div class="bk-right"></div>
												<div class="bk-left">
													<h2>
														<span>${w_name}</span>
													</h2>
												</div>
												<div class="bk-top"></div>
												<div class="bk-bottom"></div>
											</div>
											<div class="bk-info">
												<button class="bk-bookback">도서정보</button>
												<button class="bk-bookview">소개글</button>
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
						`);

						if (library_name === "자양한강") {
							$(".bk-back").last().append(`<span class="badge bg-primary" style="color: white">${library_name}</span>`);
						}
						if (library_name === "합정역") {
							$(".bk-back").last().append(`<span class="badge bg-success" style="color: white">${library_name}</span>`);
						}
						if (library_name === "광진정보") {
							$(".bk-back").last().append(`<span class="badge bg-warning" style="color: white">${library_name}</span>`);
						}
						if (library_name === "군자역") {
							$(".bk-back").last().append(`<span class="badge bg-danger" style="color: white">${library_name}</span>`);
						}
					}

					$(".mb-1").last().append(`
					<script src="static/js/book/books1.js"></script>
						<script>
							$(function() {
								Books.init();
							});
						</script>
					`)

					intent = -1;

					break;
				case 2:
				case 3:
					const resp = responseData.response;

					resp.forEach((responseMessage) => {
						showArea.append(`
						<div class="chat-message-left">
							<div>
								<img src="static/images/chatbot/SeSAC_Chatbot_Image.png" class="rounded-circle mr-1" width="40" height="40">
								<div class="text-muted small text-nowrap mt-2">${hour}:${min}</div>
							</div>
							<div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
								<div class="font-weight-bold mb-1">책GPT</div>
								${responseMessage.replaceAll("\\n", "<br>")}
							</div>
						</div>
					`);
					});

					intent = -1;

					break;
			}
			showArea.append(`
			<div class="chat-message-left pb-4">
				<img src="static/images/chatbot/SeSAC_Chatbot_Image.png" class="rounded-circle mr-1" width="40" height="40">
					<div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
							<div>
								<button class='btn2' onclick="setIntent(0);"><i class='fa fa-book'></i> 검색</button>
								<button class='btn2' onclick="setIntent(1);"><i class='fa fa-book'></i> 추천</button>
								<button class='btn2' onclick="setIntent(2);"><i class='fa fa-book'></i> 문의</button>
							</div>
					</div>
			</div>
			`);

			$.getScript('static/js/carousel/popper.min.js');
			$.getScript('static/js/carousel/owl.carousel.min.js');
			$.getScript('static/js/carousel/main.js');
		},
		error: function(request, status, error) {

			if (request.status === 429) {
				alert("너무 많은 요청입니다.");
			}

			$(".loading").remove();

			var date = new Date();
			var hour = checkTime(date.getHours());
			var min = checkTime(date.getMinutes());

			showArea.append(`
						<div class="chat-message-left pb-4">
							<div>
								<img src="static/images/chatbot/SeSAC_Chatbot_Image.png" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
								<div class="text-muted small text-nowrap mt-2">
									${hour}:${min}
								</div>
							</div>
								<div class="flex-shrink-1 bg-light rounded py-2 px-3 mㅣ-3">
									<div class="font-weight-bold mb-1">
										책GPT
									</div>
										검색하지 못했습니다.
								</div>
						</div>
						`);
			$(".chat-messages").scrollTop($("flex.flex-shrink-1").scrollHeight - $("flex.flex-shrink-1").clientHeight);
		},
		complete: function() {
			$(".loading").remove();
		}
	});
}

function getData() {
	$.get('static/files/total_book_list.csv', function(csvData) {
		var parsedData = Papa.parse(csvData, { header: true });
		const table_hover = $(".table-hover");

		for (i = 0; i < parsedData.data.length; i++) {
			table_hover.append(`
				<tr>
	                <td class="text-left">${parsedData.data[i]["TITLE"]}</td>
	                <td class="text-left">${parsedData.data[i]["AUTHOR"]}</td>
	                <td class="text-left">${parsedData.data[i]["PUBLISHER"]}</td>
	                <td class="text-left">${parsedData.data[i]["LIBRARY_NM"]}</td>
	            </tr>
			`)
		}
	});
}