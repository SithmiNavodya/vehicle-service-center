package com.vsc.vehicle_service_backend;

import com.vsc.vehicle_service_backend.model.TestEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TestDBRunner implements CommandLineRunner {

    @Autowired
    private TestEntityRepository repo;

    @Override
    public void run(String... args) throws Exception {
        TestEntity t = new TestEntity();
        t.setName("HelloDB");
        repo.save(t);

        System.out.println("Saved: " + repo.findAll());
    }
}
