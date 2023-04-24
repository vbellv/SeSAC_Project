package com.example.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class RentDTO {
	private int status;
	private String userID;
	private int lib_book_cd;
	private String libraryName;
}
