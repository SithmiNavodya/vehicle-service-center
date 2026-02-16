package com.vsc.vehicle_service_backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "finance_transaction")
public class FinanceTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", nullable = false, unique = true)
    private String transactionId;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private TransactionCategory category;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "reference_type")
    private String referenceType; // e.g., "SPARE_PART_INCOME", "SPARE_PART_USAGE", "SERVICE_RECORD"

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "related_customer_id")
    private Long relatedCustomerId;

    @Column(name = "related_vehicle_id")
    private Long relatedVehicleId;

    @Column(name = "is_reconciled", nullable = false)
    private Boolean isReconciled = false;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Enums
    public enum TransactionType {
        INCOME, EXPENSE
    }

    public enum TransactionCategory {
        // Income Categories
        SERVICE_INCOME,
        SPARE_PART_SALES,
        OTHER_INCOME,

        // Expense Categories
        SPARE_PART_PURCHASE,
        OPERATIONAL_EXPENSE,
        SALARY_EXPENSE,
        UTILITY_EXPENSE,
        MAINTENANCE_EXPENSE
    }

    // Constructors
    public FinanceTransaction() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.transactionDate = LocalDate.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public TransactionCategory getCategory() { return category; }
    public void setCategory(TransactionCategory category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getReferenceType() { return referenceType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }

    public Long getReferenceId() { return referenceId; }
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }

    public Long getRelatedCustomerId() { return relatedCustomerId; }
    public void setRelatedCustomerId(Long relatedCustomerId) { this.relatedCustomerId = relatedCustomerId; }

    public Long getRelatedVehicleId() { return relatedVehicleId; }
    public void setRelatedVehicleId(Long relatedVehicleId) { this.relatedVehicleId = relatedVehicleId; }

    public Boolean getIsReconciled() { return isReconciled; }
    public void setIsReconciled(Boolean isReconciled) { this.isReconciled = isReconciled; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}