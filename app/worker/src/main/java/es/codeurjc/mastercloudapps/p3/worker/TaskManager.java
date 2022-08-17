package es.codeurjc.mastercloudapps.p3.worker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import es.codeurjc.mastercloudapps.p3.worker.repository.TaskRepository;
import es.codeurjc.mastercloudapps.p3.worker.repository.data.TaskHistory;

import java.util.Date;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class TaskManager {

	@Autowired
	private TaskRepository taskRepository;

	private static final String NEW_TASKS_QUEUE = "newTasks";
	private static final String TASKS_PROGRESS_QUEUE = "tasksProgress";

	Logger logger = LoggerFactory.getLogger(TaskManager.class);

	static class NewTask {
		public int id;
		public String text;
	}

	static class TaskProgress {
		public int id;
		public boolean completed;
		public int progress;
		public String result;

		public TaskProgress(int id, boolean completed, int progress, String result) {
			super();
			this.id = id;
			this.completed = completed;
			this.progress = progress;
			this.result = result;
		}
	}

	ObjectMapper json = new ObjectMapper();

	@Autowired
	RabbitTemplate rabbitTemplate;

	@Autowired
	UpperCaseTask upperCaseTask;

	@RabbitListener(queues = NEW_TASKS_QUEUE, ackMode = "AUTO")
	public void received(String message) throws Exception {

		logger.info("Processing new Task: " + message);

		NewTask newTask = json.readValue(message, NewTask.class);

		taskRepository.save(TaskHistory.builder().text(newTask.text).date(new Date()).build());

		String result = upperCaseTask.toUpperCase(newTask.text);
		// result = "-"+result+"-";

		// Simulate long processing
		for (int i = 0; i < 10; i++) {

			int progress = i * 10;

			TaskProgress taskProgress = new TaskProgress(newTask.id, false, progress, null);
			String taskProgressMsg = json.writeValueAsString(taskProgress);

			logger.info("Task updated: " + taskProgressMsg);

			rabbitTemplate.convertAndSend(TASKS_PROGRESS_QUEUE, taskProgressMsg);

			Thread.sleep(500);
		}

		TaskProgress taskProgress = new TaskProgress(newTask.id, true, 100, result);

		rabbitTemplate.convertAndSend(TASKS_PROGRESS_QUEUE, json.writeValueAsString(taskProgress));

		logger.info("Task completed: " + message);
	}

}
