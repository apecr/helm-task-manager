
package es.codeurjc.mastercloudapps.p3.worker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import es.codeurjc.mastercloudapps.p3.worker.repository.data.TaskHistory;

public interface TaskRepository extends JpaRepository<TaskHistory, Integer> {
}
