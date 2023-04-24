package com.example.controller;

import com.example.mapper.BookMapper;
import com.example.dto.RentDTO;

import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {
	@Autowired
	BookMapper bookMapper;

	@GetMapping("/")
	public String index(HttpSession session) {
		String userID = (String) session.getAttribute("userID");

		session.setAttribute("userID", userID);

		return "chatbot/chatbot_chat";
	}

	@PostMapping("/rentRequest")
	@ResponseBody
	public String sendRentRequest(RentDTO dt) {
		if (dt.getStatus() == 1) {
			bookMapper.setAlarm(dt);
		}
		
		switch(dt.getLibraryName()) {
			case "자양한강":
				bookMapper.sendRentRequestToJayang(dt);
				break;
			case "광진정보":
				bookMapper.sendRentRequestToGwangjin(dt);
				break;
			case "군자역":
				bookMapper.sendRentRequestToGunja(dt);
				break;
			case "합정역":
				bookMapper.sendRentRequestToHabjung(dt);
				break;
			default:
				throw new IllegalArgumentException("Unknown library name: " + dt.getLibraryName());
		}

		return "success";
	}
}
