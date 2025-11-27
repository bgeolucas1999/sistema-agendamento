package com.reserves.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.time.LocalDateTime;

public class ReservationUpdateRequest {
    private String userName;
    
    @Email(message = "Email inválido")
    private String userEmail;
    
    @Pattern(regexp = "^[\\d\\s\\+\\-\\(\\)]*$", message = "Telefone inválido")
    private String userPhone;
    
    @NotNull(message = "Horário de início é obrigatório")
    private LocalDateTime startTime;
    
    @NotNull(message = "Horário de término é obrigatório")
    private LocalDateTime endTime;
    
    private String notes;

    public ReservationUpdateRequest() {}

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
