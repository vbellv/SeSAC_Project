-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.11.0-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- sesac 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `sesac` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `sesac`;

-- 테이블 sesac.board 구조 내보내기
CREATE TABLE IF NOT EXISTS `board` (
  `boardNo` int(11) NOT NULL AUTO_INCREMENT,
  `boardTitle` varchar(100) NOT NULL DEFAULT '0',
  `boardContent` longtext NOT NULL,
  `boardWriter` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`boardNo`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;

-- 테이블 데이터 sesac.board:~5 rows (대략적) 내보내기
DELETE FROM `board`;
/*!40000 ALTER TABLE `board` DISABLE KEYS */;
INSERT INTO `board` (`boardNo`, `boardTitle`, `boardContent`, `boardWriter`) VALUES
	(1, '자바 개념', '자바의 개념이 잘 이해가 안 됩니다.', '흥부'),
	(2, '실습 문의', '수업 시간에 실습하는지 궁금합니다.', '싹'),
	(3, '프로그래밍 언어', '자바 말고 다른 프로그래밍 언어가 있는지 궁금합니다.', '소금'),
	(4, '퀴즈 문의', '퀴즈 정답이 왜 자바인지 궁금합니다!', '홍길동'),
	(5, '요약', '오늘 수업에 대한 요약본이 있나요?', '심청이');
/*!40000 ALTER TABLE `board` ENABLE KEYS */;

-- 테이블 sesac.user 구조 내보내기
CREATE TABLE IF NOT EXISTS `user` (
  `userId` varchar(50) NOT NULL,
  `userPw` varchar(50) NOT NULL,
  `classOf` varchar(50) NOT NULL,
  `userName` varchar(50) NOT NULL,
  PRIMARY KEY (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 테이블 데이터 sesac.user:~6 rows (대략적) 내보내기
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`userId`, `userPw`, `classOf`, `userName`) VALUES
	('kim', '1234', '20202', '흥부'),
	('pong', '1234', '30516', '심청이'),
	('sac', 'sac', '11111', '싹'),
	('salt', '1234', '10209', '소금'),
	('sesac', '1234', '30303', '새싹'),
	('test', '1234', '10101', '홍길동');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
