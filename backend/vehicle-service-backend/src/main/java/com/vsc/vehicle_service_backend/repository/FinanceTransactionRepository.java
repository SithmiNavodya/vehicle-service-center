package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.FinanceTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FinanceTransactionRepository extends JpaRepository<FinanceTransaction, Long> {

    List<FinanceTransaction> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate);

    List<FinanceTransaction> findByTransactionType(FinanceTransaction.TransactionType transactionType);

    List<FinanceTransaction> findByCategory(FinanceTransaction.TransactionCategory category);

    List<FinanceTransaction> findByReferenceTypeAndReferenceId(String referenceType, Long referenceId);

    @Query("SELECT ft FROM FinanceTransaction ft WHERE ft.relatedCustomerId = :customerId")
    List<FinanceTransaction> findByRelatedCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT ft FROM FinanceTransaction ft WHERE ft.relatedVehicleId = :vehicleId")
    List<FinanceTransaction> findByRelatedVehicleId(@Param("vehicleId") Long vehicleId);

    @Query("SELECT SUM(ft.amount) FROM FinanceTransaction ft " +
            "WHERE ft.transactionType = 'INCOME' " +
            "AND ft.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalIncomeBetweenDates(@Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(ft.amount) FROM FinanceTransaction ft " +
            "WHERE ft.transactionType = 'EXPENSE' " +
            "AND ft.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalExpenseBetweenDates(@Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    @Query("SELECT ft.category as category, SUM(ft.amount) as total " +
            "FROM FinanceTransaction ft " +
            "WHERE ft.transactionType = 'INCOME' " +
            "AND ft.transactionDate BETWEEN :startDate AND :endDate " +
            "GROUP BY ft.category")
    List<Object[]> getIncomeByCategory(@Param("startDate") LocalDate startDate,
                                       @Param("endDate") LocalDate endDate);

    @Query("SELECT ft.category as category, SUM(ft.amount) as total " +
            "FROM FinanceTransaction ft " +
            "WHERE ft.transactionType = 'EXPENSE' " +
            "AND ft.transactionDate BETWEEN :startDate AND :endDate " +
            "GROUP BY ft.category")
    List<Object[]> getExpenseByCategory(@Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    @Query("SELECT MONTH(ft.transactionDate) as month, YEAR(ft.transactionDate) as year, " +
            "SUM(CASE WHEN ft.transactionType = 'INCOME' THEN ft.amount ELSE 0 END) as income, " +
            "SUM(CASE WHEN ft.transactionType = 'EXPENSE' THEN ft.amount ELSE 0 END) as expense " +
            "FROM FinanceTransaction ft " +
            "WHERE ft.transactionDate >= :startDate " +
            "GROUP BY YEAR(ft.transactionDate), MONTH(ft.transactionDate) " +
            "ORDER BY YEAR(ft.transactionDate), MONTH(ft.transactionDate)")
    List<Object[]> getMonthlySummary(@Param("startDate") LocalDate startDate);

    @Query("SELECT ft.transactionDate as date, " +
            "SUM(CASE WHEN ft.transactionType = 'INCOME' THEN ft.amount ELSE 0 END) as dailyIncome, " +
            "SUM(CASE WHEN ft.transactionType = 'EXPENSE' THEN ft.amount ELSE 0 END) as dailyExpense " +
            "FROM FinanceTransaction ft " +
            "WHERE ft.transactionDate BETWEEN :startDate AND :endDate " +
            "GROUP BY ft.transactionDate " +
            "ORDER BY ft.transactionDate")
    List<Object[]> getDailyCashFlow(@Param("startDate") LocalDate startDate,
                                    @Param("endDate") LocalDate endDate);

    // Add this missing method:
    long countByTransactionDateBetween(LocalDate startDate, LocalDate endDate);
}