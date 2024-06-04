import * as tasks from "@google-cloud/tasks";
import { CloudTaskConfig } from "./types";

/**
A wrapper around @google-cloud/tasks with additional methods 
 */
export class CloudTaskWrapper {
  private client: tasks.CloudTasksClient;
  private project: string;
  private location: string;
  constructor(config: CloudTaskConfig) {
    this.client = new tasks.v2.CloudTasksClient();
    this.project = process.env.PROJECT_ID || config?.project;
    this.location = process.env.QUEUE_LOCATION || config?.location;
  }

  /*******************
   * CLOUD TASKS
   *******************/

  /**
   *
   * @param task The task object
   * @param name The name of the cloud task (optional)
   * @returns the name of created cloud task
   */
  async createCloudTask(
    task: tasks.protos.google.cloud.tasks.v2.ITask,
    queue: string,
    name?: string
  ) {
    try {
      const { client, project, location } = this;

      const parent = client.queuePath(project, location, queue);

      if (name) {
        task.name = client.taskPath(project, location, queue, name);
      }

      const request: tasks.protos.google.cloud.tasks.v2.ICreateTaskRequest = {
        parent: parent,
        task: task,
      };

      const [response] = await client.createTask(request);

      const { name: createdTaskName } = response;
      return createdTaskName;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Fetches the full view of cloud task by name
   * @param name Name of the cloud task to be retrieved
   * @returns the Task Details of cloud task
   */
  async getCloudTaskByName(name: string, queue: string) {
    try {
      const { client, project, location } = this;
      const taskPath = client.taskPath(project, location, queue, name);
      const request: tasks.protos.google.cloud.tasks.v2.IGetTaskRequest = {
        name: taskPath,
        responseView: "FULL",
      };
      const [taskData] = await client.getTask(request);
      return taskData;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Deletes the cloud task by name
   * @param name Name of the cloud task to be deleted
   * @returns
   */
  async deleteCloudTaskByName(name: string, queue: string) {
    try {
      const { client, project, location } = this;
      const taskPath = client.taskPath(project, location, queue, name);
      const request: tasks.protos.google.cloud.tasks.v2.IDeleteTaskRequest = {
        name: taskPath,
      };
      await client.deleteTask(request);
      return;
    } catch (e) {
      throw e;
    }
  }

  /**
   *
   * @param regex regular expression to match the name of a cloud task
   * @returns list of tasks with name that matches the regular expression
   */

  async getCloudTasksByRegex(
    regex: string,
    queue: string
  ): Promise<tasks.protos.google.cloud.tasks.v2.ITask[]> {
    try {
      const parent = this.client.queuePath(this.project, this.location, queue);
      const request: tasks.protos.google.cloud.tasks.v2.IListTasksRequest = {
        parent,
      };

      const regularExpression = new RegExp(regex);

      const cloudTasks = await this.client.listTasks(request);

      const matchedTasks = cloudTasks[0].filter(({ name }) => {
        const taskName = name.split("/").pop();
        return regularExpression.test(taskName);
      });

      return matchedTasks;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Updates the Http Request body of a cloud task
   * @param name Name of the cloud task
   * @param body The new body of http request to be updated in the cloud task
   * @param newName The new name for cloud task - optional
   * @returns created cloud task name
   */

  async updateHttpCloudTaskBody(
    name: string,
    body: string,
    queue: string,
    newName?: string
  ) {
    try {
      const { project, location, client } = this;
      const existingTaskPath = client.taskPath(project, location, queue, name);

      const existingTaskRequest: tasks.protos.google.cloud.tasks.v2.IGetTaskRequest =
        {
          name: existingTaskPath,
          responseView: "FULL",
        };

      const [taskData] = await client.getTask(existingTaskRequest);

      const task: tasks.protos.google.cloud.tasks.v2.ITask = {
        ...taskData,
        ...(newName && { name: newName }),
      };

      task.httpRequest.body = body;

      const parent = client.queuePath(project, location, queue);

      const request: tasks.protos.google.cloud.tasks.v2.ICreateTaskRequest = {
        parent: parent,
        task: task,
      };

      const [response] = await client.createTask(request);

      //Delete existing task

      const deleteExistingTaskRequest: tasks.protos.google.cloud.tasks.v2.IDeleteTaskRequest =
        {
          name: existingTaskPath,
        };
      await client.deleteTask(deleteExistingTaskRequest);

      const { name: createdTaskName } = response;

      return createdTaskName;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Updates the AppEngine Request body of a cloud task
   * @param name Name of the cloud task
   * @param body The new body of http request to be updated in the cloud task
   * @param newName The new name for cloud task - optional
   * @returns created cloud task name
   */
  async updateAppEngineCloudTaskBody(
    name: string,
    body: string,
    queue: string,
    newName?: string
  ) {
    try {
      const { project, location, client } = this;
      const existingTaskPath = client.taskPath(project, location, queue, name);

      const existingTaskRequest: tasks.protos.google.cloud.tasks.v2.IGetTaskRequest =
        {
          name: existingTaskPath,
          responseView: "FULL",
        };

      const [taskData] = await client.getTask(existingTaskRequest);

      const task: tasks.protos.google.cloud.tasks.v2.ITask = {
        ...taskData,
        ...(newName && { name: newName }),
      };

      task.appEngineHttpRequest.body = body;

      const parent = client.queuePath(project, location, queue);

      const request: tasks.protos.google.cloud.tasks.v2.ICreateTaskRequest = {
        parent: parent,
        task: task,
      };

      const [response] = await client.createTask(request);

      //Delete existing task

      const deleteExistingTaskRequest: tasks.protos.google.cloud.tasks.v2.IDeleteTaskRequest =
        {
          name: existingTaskPath,
        };
      await client.deleteTask(deleteExistingTaskRequest);

      const { name: createdTaskName } = response;

      return createdTaskName;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Updates the cloud task scheduled time - works for both AppEngineRequests and HttpRequests
   * @param scheduledTime Number of minutes from which the cloud task has to be triggered (UTC)
   * @param name Name of the existing cloud task name
   * @param newName field to send the new name for cloud task - optional(cloud task cannot be created with the same old name)
   */

  async updateCloudTaskScheduledTime(
    name: string,
    inMinutes: number,
    queue: string,
    newName?: string
  ) {
    try {
      const { project, location, client } = this;

      //Fetch the existing task and get the required data
      const existingTaskPath = client.taskPath(project, location, queue, name);

      const existingTaskRequest: tasks.protos.google.cloud.tasks.v2.IGetTaskRequest =
        {
          name: existingTaskPath,
          responseView: "FULL",
        };

      const [taskData] = await client.getTask(existingTaskRequest);

      //Create a new task with updated time

      const task: tasks.protos.google.cloud.tasks.v2.ITask = {
        ...taskData,
        ...(newName && { name: newName }),
        scheduleTime: {
          seconds: inMinutes * 60 + Date.now() / 1000,
        },
      };

      const parent = client.queuePath(project, location, queue);

      const request: tasks.protos.google.cloud.tasks.v2.ICreateTaskRequest = {
        parent: parent,
        task: task,
      };

      const [response] = await client.createTask(request);

      //Delete existing task

      const deleteExistingTaskRequest: tasks.protos.google.cloud.tasks.v2.IDeleteTaskRequest =
        {
          name: existingTaskPath,
        };
      await client.deleteTask(deleteExistingTaskRequest);

      const { name: createdTaskName } = response;

      return createdTaskName;
    } catch (e) {
      throw e;
    }
  }

  /*****************
   *    QUEUES
   *****************/

  async listQueues() {
    try {
      const { client, project, location } = this;
      // Get the fully qualified path to the region
      const parent = client.locationPath(project, location);

      // list all fo the queues
      const [queues] = await client.listQueues({ parent });

      return queues;
    } catch (e) {
      throw e;
    }
  }
}
