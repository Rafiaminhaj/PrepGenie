package com.rafia.prepgenie.service;

import com.rafia.prepgenie.entity.User;
import org.springframework.context.ApplicationEvent;

public class ModuleCompletedEvent extends ApplicationEvent {
    private final User user;
    private final String moduleType; // "QUIZ", "RESUME", "CHAT"

    public ModuleCompletedEvent(Object source, User user, String moduleType) {
        super(source);
        this.user = user;
        this.moduleType = moduleType;
    }

    public User getUser() { return user; }
    public String getModuleType() { return moduleType; }
}
