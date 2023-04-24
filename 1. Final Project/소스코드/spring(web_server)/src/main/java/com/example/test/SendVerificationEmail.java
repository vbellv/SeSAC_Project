package com.example.test;

import java.security.SecureRandom;

import java.util.Properties;

import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.PasswordAuthentication;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;


/**
 * 
 * 사용자가 회원가입과 같은,
 * 보안성이 필히 요구되는 동작을 하려 할 때
 * 본인 인증을 위해 구현한 모듈. 
 * 
 * @author 장동근
 */

public class SendVerificationEmail {	
	/**
	 * 
	 * 숫자 0과 1, 알파벳 대문자 I와 O는 혼동될 가능성이 있으므로 누락시킴.
	 * 
	 * @return N개의 수와 대문자로 구성된 난수. 예) 59NNW5
	 */
	public String randForVerification() {
		final int randLength = 6;

		StringBuffer result = new StringBuffer();
		SecureRandom randNo = new SecureRandom();

		for (int i = 0; i < randLength; i++) {
			char char_temp;
			int int_temp = 0;

			if (randNo.nextBoolean()) {
				do {
					char_temp = (char) ((int) (randNo.nextInt(26)) + 65);
				} while (char_temp == 'I' || char_temp == 'O');

				result.append(char_temp);
			} else {
				do {
					int_temp = randNo.nextInt(10);
				} while (int_temp == 0 || int_temp == 1);

				result.append(int_temp);
			}
		}

		String final_result = result.toString();

		return final_result;
	}
	
	/**
	 * SMTP(randomString, Personal E-mail Address)
	 * 
	 * @param Personal E-mail address 
	 */
	public void SMTP(String result, String receiver) {
		final String user = "jdg981116@naver.com";
		final String password = "R3FZ5BVQFMZY";

		Properties prop = new Properties();

		prop.put("mail.smtp.ssl.enable", "true");
		prop.put("mail.smtp.ssl.trust", "smtp.naver.com");
		prop.put("mail.smtp.host", "smtp.naver.com");
		prop.put("mail.smtp.auth", "true");
		prop.put("mail.smtp.port", "465");

		Session session = Session.getInstance(prop, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(user, password);
			}
		});

		try {
			MimeMessage message = new MimeMessage(session);

			message.setFrom(new InternetAddress(user));
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(receiver));
			message.setSubject("인증 메일입니다.");
			message.setText(result);

			Transport.send(message);

			System.out.println("message sent successfully...");

		} catch (AddressException e) {
			e.printStackTrace();
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

}
