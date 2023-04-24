/**
 * 
 */

var hasID = false;
var hasName = false;
var hasBirthDay = false;
var hasEmail = false;

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
			idWarning.show();
			hasID = false;
		} else {
			idWarning.hide();
			hasID = true;
		}
	});
});

$(document).ready(function() {
	let nameWarning = $("#nm_warning");

	$('#user_nm').on('focusout', function() {
		const regExp = /^[가-힣]{2,4}$/;

		if (!$(this).val().match(regExp)) {
			nameWarning.html(`
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
				</svg>
				이름을 입력해주세요.
			`);
			nameWarning.show();
			hasName = false;
		} else {
			nameWarning.hide();
			hasName = true;
		}
	});
});

$(document).ready(function() {
	let birthWarning = $("#birth_warning");

	$('#user_birth').on('focusout', function() {
		const regExp = /[0-9]{8}$/;

		if (!$(this).val().match(regExp)) {
			birthWarning.html(`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
				<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
			</svg>
			특수문자를 뺀 숫자 8자리를 입력해주세요.
			`);
			birthWarning.show();
			hasBirthDay = false;
		} else {
			birthWarning.hide();
			hasBirthDay = true;
		}
	});
});

$(document).ready(function() {
	let emailWarning = $("#email_warning");

	$('#email').on('focusout', function() {
		const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

		if (!$(this).val().match(regExp)) {
			emailWarning.html(`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-5 -5 27 27">
				<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-3v4m0 3v.01" />
			</svg>
			정확한 이메일 주소를 입력해주세요.
			`);
			emailWarning.show();
			hasEmail = false;
		} else {
			emailWarning.hide();
			hasEmail = true;
		}
	});
});

function sendFindRequest() {
	if (hasID == false) {
		return false;
	}
	
	if (hasName == false) {
		return false;
	}

	if (hasBirthDay == false) {
		return false;
	}

	if (hasEmail == false) {
		return false;
	}
	
	const form = $("#searchRequest");
	form.submit();
}