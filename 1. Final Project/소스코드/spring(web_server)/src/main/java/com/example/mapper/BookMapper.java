package com.example.mapper;

import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import com.example.dto.RentDTO;
import com.example.dto.UserDTO;

@Mapper
public interface BookMapper {

	public void rentBook(int search_bcode);
	public void changeState(int search_bcode);
	
	public int confirmUserLogin(HashMap<String, String> userResponse);
	
	public void insertToTotal(UserDTO userInputValue);
	public void insertToGwangjin(UserDTO userInputValue);
	public void insertToGunja(UserDTO userInputValue);
	public void insertToJayang(UserDTO userInputValue);
	public void insertToHabjung(UserDTO userInputValue);
	
	public int checkDuplicateID(String user_id);
	public int checkEmail(String email);
	public int checkPhone(String phone);
	
	public String findID(HashMap<String, String> userInputValue);
	public String findPW(HashMap<String, String> userInputValue);
	
	public void sendRentRequestToJayang(RentDTO rd);
	public void sendRentRequestToGwangjin(RentDTO rd);
	public void sendRentRequestToHabjung(RentDTO rd);
	public void sendRentRequestToGunja(RentDTO rd);
	
	public void setAlarm(RentDTO rd);
}
