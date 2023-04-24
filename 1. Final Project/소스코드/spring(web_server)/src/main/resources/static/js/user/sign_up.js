/**
 * 
 */
var interval;

var isIdUnique = false;
var isPwUnique = false;
var hasName = false;
var isPhoneUnique = false;
var hasBirthDay = false;
var hasAddr = false;
var isEmailUnique = false;
var doneVerification = false;


/**
 * 아이디 값의 형식이 올바른지, 값이 중복인지 확인
 * 아이디 값의 형식은 영문, 숫자를 포함한 4 ~ 12개의 문자열. 
 */
$(document).ready(function() {
	let idWarning = $("#id_warning");

	$('#user_id').on('focusout', function() {
		const regExp = /^[a-z0-9]{4,12}$/;

		if (!$(this).val().match(regExp)) {
			idWarning.html(`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
				<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
			</svg>
			아이디는 영문, 숫자를 포함한 4 ~ 12자리입니다.
			`);
			idWarning.show()
			isIdUnique = false;
		} else {
			checkID(idWarning, $(this).val());
		}
	});
});

/**
 * 비밀번호 값의 형식이 올바른지 확인.
 * 비밀번호 값의 형식은 영문, 숫자, 특수문자를 각각 한 개 이상 포함한 8 ~ 15개의 문자열.
 */
$(document).ready(function() {
	let pwWarning = $("#pw_warning");

	$("#user_pw").on("focusout", function() {
		var regExp = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

		if (!$(this).val().match(regExp)) {
			pwWarning.html(`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
				<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
			</svg>
			비밀번호는 영문, 숫자, 특수문자를 각각 한 개 이상 포함한 8 ~ 15자리입니다.
			`);
			pwWarning.show();
			isPwUnique = false;
		} else {
			pwWarning.hide();
			isPwUnique = true;
		}
	});
});


/**
 * 이름 값 형식이 올바른지 확인.
 * 이름 값의 형식은 한글 2 ~ 4자의 문자열.
 */
$(document).ready(function() {
	let nmWarning = $("#nm_warning");

	$("#user_nm").on("focusout", function() {
		var regExp = /^[가-힣]{2,4}$/;

		if (!$(this).val().match(regExp)) {
			nmWarning.html(`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
				<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
			</svg>
			이름을 정확하게 입력해주십시오.
			`);
			nmWarning.show();
			hasName = false;
		} else {
			nmWarning.hide();
			hasName = true;
		}
	});
});

/**
 * 전화번호 값의 형식이 올바른지, 값이 중복인지 확인.
 * 전화번호 값은 '-' 혹은 '/'가 포함되어 있지 않아야 함. 
 */
$(document).ready(function() {
	let phoneWarning = $("#phone_warning");

	$("#phone").on("focusout", function() {
		var regExp = /[0-9]{11}$/;

		if (!$(this).val().match(regExp)) {
			phoneWarning.html(`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
				<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
			</svg>
			특수문자를 뺀 숫자만 입력해주십시오.
			`);
			phoneWarning.show();
			isPhoneUnique = false;
		} else {
			checkPhone(phoneWarning, $(this).val());
		}
	});
});

/**
 * 생일 값 형식이 올바른지 확인.
 * 생일 값은 '-' 혹은 '/'가 포함되어 있어도 되고 있지 않아도 됨. 
 */
$(document).ready(function() {
	let birthWarning = $("#birth_warning");

	$("#user_birth").on("focusout", function() {
		var regExp = /[0-9]{8}$/;

		if (!$(this).val().match(regExp)) {
			birthWarning.html(`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
				<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
			</svg>
			특수문자를 뺀 숫자 8자리를 입력해주십시오.
			`);
			birthWarning.show();
			hasBirthDay = false;
		} else {
			birthWarning.hide();
			hasBirthDay = true;
		}
	});
});

/**
 * 집 주소 값이 있는지 확인.
 */
$(document).ready(function() {
	let addrWarning = $("#addr_warning");

	$("#user_addr").on("focusout", function() {
		if (!$(this).val() == null || $(this).val() == "") {
			addrWarning.html(`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
				<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
			</svg>
			주소를 입력해주십시오.
			`);
			addrWarning.show();
			hasAddr = false;
		} else {
			addrWarning.hide();
			hasAddr = true;
		}
	});
});

/**
 * 이메일 값의 형식이 올바른지, 값이 중복인지 확인
 */
var isButtonClicked = false;

$(document).ready(function() {
	let emailWarning = $("#email_warning");
	let sendCodeButton = $(".btn_email");

	$("#emailField").on("focusout", function() {
		const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

		if (!$(this).val().match(regExp)) {
			emailWarning.html(`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
				<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
			</svg>
			정확한 이메일 형식을 입력해주십시오.`
			);
			emailWarning.show();

			if (isButtonClicked == false) {
				sendCodeButton.attr("disabled", true);
			}

			isEmailUnique = false;
		} else {
			checkEmail(sendCodeButton, emailWarning, $(this).val());
		}
	});
});


/**
 * 이메일로 인증번호 전송
 */
var verificationCode = "";

function sendVerificationEmail() {
	const display = document.getElementById('timer');
	const emailField = $("#emailField").val();

	$.ajax({
		url: "/sendVerification",
		type: "POST",
		data: {
			userEmail: emailField
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "text",
		success: function(responseData) {
			verificationCode = responseData;
		}
	});

	startTimer(display);
}

function startTimer(display) {
	const duration = (60 * 3) - 1;
	const sendButton = $(".btn_email");
	var timer = duration, minutes, seconds;

	isButtonClicked = true;
	sendButton.attr("disabled", true);

	interval = setInterval(function() {
		minutes = parseInt(timer / 60, 10)
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		display.textContent = minutes + ":" + seconds;

		if (--timer < 0) {
			timer = duration;
		}
		if (timer === 0) {
			clearInterval(interval);
			display.textContent = "세션 만료!";
		}
	}, 1000);

	setInterval(function() {
		sendButton.prop("disabled", false);
		isButtonClicked = false;
	}, 18000);
}

function checkID(warningDiv, user_id) {
	$.ajax({
		url: "/checkDuplicateID",
		type: "POST",
		data: {
			user_id: user_id
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "JSON",
		success: function(responseData) {
			if (responseData == 0) {
				warningDiv.hide();
				isIdUnique = true;
			} else {
				warningDiv.html(`
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
				</svg>
				이미 있는 아이디입니다.
				`);
				warningDiv.show();
				isIdUnique = false;
			}
		}
	});
}

function checkPhone(warningDiv, phone) {
	$.ajax({
		url: "/checkDuplicatePhone",
		type: "POST",
		data: {
			phone: phone
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "JSON",
		success: function(responseData) {
			if (responseData == 0) {
				warningDiv.hide();
				isPhoneUnique = true;
			} else {
				warningDiv.html(`
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
				</svg>
				이미 있는 번호입니다.
				`);
				warningDiv.show();
				isPhoneUnique = false;
			}
		}
	});
}

function checkEmail(sendButton, warningDiv, email) {
	$.ajax({
		url: "/checkDuplicateEmail",
		type: "POST",
		data: {
			email: email
		},
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "text",
		success: function(responseData) {

			if (responseData == 0) {
				warningDiv.hide();
				sendButton.attr("disabled", false);
				isEmailUnique = true;
			} else {
				warningDiv.html(`
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
				</svg>
				이미 있는 이메일 주소입니다.
				`);
				warningDiv.show();
			}
		}
	});
}

function checkVerificationCode() {
	const userInputCode = $("#userVerificationCode").val();
	const codeWarning = $("#code_warning");
	const display = document.getElementById('timer');
	const button = $("#btn_email");

	if (verificationCode != '') {
		if (userInputCode == verificationCode) {
			clearInterval(interval);
			display.textContent = "인증됨";
			button.prop("disabled", true);
			doneVerification = true;
			codeWarning.hide();
		} else {
			codeWarning.html(`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
				<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
			</svg>
			이미 있는 이메일 주소입니다.
			`);
			codeWarning.show();
		}
	}
}

/**
 * 최종 확인 및 승인
 */
function sendSignUpRequest() {
	if (isIdUnique == false) {
		alert("1");
		return false;
	}

	if (isPwUnique == false) {
		alert("2");
		return false;
	}

	if (hasName == false) {
		alert("3");
		return false;
	}

	if (isPhoneUnique == false) {
		alert("4");
		return false;
	}

	if (hasBirthDay == false) {
		alert("5");
		return false;
	}

	if (hasAddr == false) {
		alert("6");
		return false;
	}

	if (isEmailUnique == false) {
		alert("7");
		return false;
	}

	if (doneVerification == false) {
		alert("8");
		return false;
	}


	const form = $("#login-in");
	form.submit();
}
