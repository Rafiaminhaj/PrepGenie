package com.rafia.prepgenie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.rafia.prepgenie.entity.User;
import com.rafia.prepgenie.repository.UserRepository;

@SpringBootApplication
public class PrepGenieApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                PrepGenieApplication.class,
                args);
    }

    @Bean
    public CommandLineRunner loadData(UserRepository repository) {
        return (args) -> {
            if (repository.count() == 0) {
                // No dummy users, only real registered users will appear
            }
        };
    }
}