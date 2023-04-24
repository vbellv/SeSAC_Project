
function sendUserLoginRequest() {
	const userID = $("#userID");
	const userPW = $("#userPW");
	const loginForm = $("#login-in");
	
	if (userID.val() == "" || userID.val() == null) {
		alert("아이디를 입력해주세요");
		
		return false;
	}
	if (userPW.val() == "" || userPW.val() == null) {
		alert("비밀번호를 입력해주세요");
		
		return false;
	}
	
	loginForm.submit();
	
}