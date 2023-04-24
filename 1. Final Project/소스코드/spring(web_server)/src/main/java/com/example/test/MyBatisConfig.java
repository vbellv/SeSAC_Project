package com.example.test;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan(basePackages="com.example.mapper")
public class MyBatisConfig {

}
