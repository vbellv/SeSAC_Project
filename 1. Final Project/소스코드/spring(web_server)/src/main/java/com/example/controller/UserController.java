package com.example.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.dto.UserDTO;
import com.example.mapper.BookMapper;
import com.example.test.SendVerificationEmail;

@Controller
public class UserController {
	@Autowired
	BookMapper bookMapper;

	@GetMapping("/login")
	public String login() {
		return "user/login";
	}

	@PostMapping("/login")
	public String confirmUserLogin(Model model, @RequestParam("userID") String userID,
			@RequestParam("userPW") String userPW) {
		HashMap<String, String> userResponse = new HashMap<String, String>();

		userResponse.put("userID", userID);
		userResponse.put("userPW", userPW);

		try {
			int flag = bookMapper.confirmUserLogin(userResponse);

			if (flag == 1) {
				model.addAttribute("userID", userID);
				System.out.println(userID + "님이 입장하셨습니다");
				return "chatbot/chatbot_chat";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "redirect:login";
	}
	
	@GetMapping("/findID")
	public String findID() {
		return "user/id_search";
	}

	@GetMapping("/findPW")
	public String findPW() {
		return "user/pw_search";
	}
	
	@GetMapping("/register")
	public String registerUser() {
		return "user/sign_up";
	}

	@PostMapping("/sendVerification")
	@ResponseBody
	public String sendEmail(@RequestParam("userEmail") String userEmail) {
		SendVerificationEmail sve = new SendVerificationEmail();

		String verificationCode = sve.randForVerification();

		sve.SMTP(verificationCode, userEmail);

		return verificationCode;
	}
	
	@PostMapping("/checkDuplicateID")
	@ResponseBody
	public int checkDuplicateID(@RequestParam("user_id") String user_id) {
		int responseFromDatabase = bookMapper.checkDuplicateID(user_id);

		return responseFromDatabase;

	}

	@PostMapping("/checkDuplicatePhone")
	@ResponseBody
	public int checkDuplicatePhone(@RequestParam("phone") String phone) {
		int responseFromDatabase = bookMapper.checkPhone(phone);

		return responseFromDatabase;
	}

	@PostMapping("/checkDuplicateEmail")
	@ResponseBody
	public int checkDuplicateEmail(@RequestParam("email") String email) {
		int responseFromDatabase = bookMapper.checkEmail(email);

		return responseFromDatabase;
	}

	@PostMapping("/sendSignUpRequest")
	public String sendSignUpRequest(UserDTO userInputValue) {
		userInputValue.setRole("USER");

		bookMapper.insertToTotal(userInputValue);
		bookMapper.insertToGwangjin(userInputValue);
		bookMapper.insertToGunja(userInputValue);
		bookMapper.insertToJayang(userInputValue);
		bookMapper.insertToHabjung(userInputValue);

		return "redirect:login";
	}

	@PostMapping("/sendFindIdRequest")
	public String sendFindIdRequest(@RequestParam("user_nm") String user_nm,
			@RequestParam("user_birth") String user_birth, @RequestParam("email") String email) {
		SendVerificationEmail sve = new SendVerificationEmail();

		HashMap<String, String> userInputValue = new HashMap<>();

		userInputValue.put("user_nm", user_nm);
		userInputValue.put("user_birth", user_birth);
		userInputValue.put("email", email);

		String responseFromDatabase = bookMapper.findID(userInputValue);

		sve.SMTP(responseFromDatabase, email);

		return "user/login";
	}
	
	@PostMapping("sendFindPwRequest")
	public String sendFindPwRequest(@RequestParam("user_id") String user_id, @RequestParam("user_nm") String user_nm,
			@RequestParam("user_birth") String user_birth, @RequestParam("email") String email) {
		SendVerificationEmail sve = new SendVerificationEmail();

		HashMap<String, String> userInputValue = new HashMap<>();

		userInputValue.put("user_id", user_id);
		userInputValue.put("user_nm", user_nm);
		userInputValue.put("user_birth", user_birth);
		userInputValue.put("email", email);

		String responseFromDatabase = bookMapper.findPW(userInputValue);

		sve.SMTP(responseFromDatabase, email);

		return "user/login";
	}

}
