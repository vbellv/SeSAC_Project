package com.example.dto;

import java.sql.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class UserDTO {
	private String user_id;
	private String user_pw;
	private String user_nm;
	private int user_sex;
	private String phone;
	private int user_birth;
	private int user_age;
	private String user_addr;
	private String email;
	private String role;
}