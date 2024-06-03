# Cloud Task Wrapper: Node.js Client

Cloud Tasks Wrapper API client for Node.js

This module offers additional wrapper on top of @google-cloud/tasks (https://www.npmjs.com/package/@google-cloud/task).
There are some of the features that are missing as part of the current @google-cloud/task module. This cloud task wrapper aims at addressing the missing utils by using @google-cloud/task under the hood.

## Challenges this Cloud Task Wrapper addresses:

1. Easier instantiation of cloud task client (just pass the config and access the methods)
2. Unless you know the complete name of a cloud task, you wouldn't be able to fetch or access the task. This module makes it easier. Provide a regex and it gives you the list of matching cloud tasks
3. Update the scheduled time of a cloud task - App Engine/Http Request
4. Update the body of a cloud task - AppEngineRequest
5. Update the body of a cloud task - HttpRequest
6. Simplifies creation, deletion and listing queues

## Quickstart

### Before you begin

1.  [Select or create a Cloud Platform project][projects].
1.  [Enable billing for your project][billing].
1.  [Enable the Cloud Tasks API][enable_api].
1.  [Set up authentication with a service account][auth] so you can access the
    API from your local workstation.

### Installing the client library

```bash
npm i cloud-task-wrapper
```

### Using the client library to fetch tasks that match regex

```javascript
// Imports the Google Cloud Tasks Wrapper library.
const { CloudTaskWrapper } = require("cloud-task-wrapper");

async function quickstart() {
  // TODO(developer): Uncomment these lines and replace with your values.
  // const project = 'my-project-id';
  // const queue = 'my-appengine-queue';
  // const location = 'us-central1';

  const config = {
    project,
    queue,
    location,
  };

  const wrapper = new CloudTaskWrapper(config);
  const cloudTasks = await wrapper.getCloudTasksByRegex(regex); //regex that matches name of your cloud task

  console.log(`List of matching cloud tasks ${cloudTasks}`);
}
quickstart();
```

### Using the client library to delete tasks that match regex

```javascript
// Imports the Google Cloud Tasks Wrapper library.
const { CloudTaskWrapper } = require("cloud-task-wrapper");

async function quickstart() {
  // TODO(developer): Uncomment these lines and replace with your values.
  // const project = 'my-project-id';
  // const queue = 'my-appengine-queue';
  // const location = 'us-central1';

  const config = {
    project,
    location,
  };

  const wrapper = new CloudTaskWrapper(config);
  const cloudTasks = await wrapper.getCloudTasksByRegex(regex, queue); //regex that matches name of your cloud task

  for (const cloudTask of cloudTasks) {
    const taskName = cloudTask.name.split("/").pop();
    await wrapper.deleteCloudTaskByName(taskName, queue);
  }

  console.log(`List of deleted cloud tasks ${cloudTasks}`);
}
quickstart();
```

### Using the client library to update the scheduled time of a cloud task

```javascript
// Imports the Google Cloud Tasks Wrapper library.
const { CloudTaskWrapper } = require("cloud-task-wrapper");

async function quickstart() {
  // TODO(developer): Uncomment these lines and replace with your values.
  // const project = 'my-project-id';
  // const queue = 'my-appengine-queue';
  // const location = 'us-central1';

  const config = {
    project,
    location,
  };

  const wrapper = new CloudTaskWrapper(config);

  //TODO: Uncomment these lines and replace with values name of the cloud task to be updated, time in minutes to be triggered (UTC), new Name is optional

  //const name = 'cloud task name';
  //const inMinutes = 20
  //const newName = 'This is optional';

  const updatedCloudTask = await wrapper.updateCloudTaskScheduledTime(
    name,
    20,
    queue,
    newName
  );

  console.log(`Updated the cloud task and its new name - ${updatedCloudTask}`);
}
quickstart();
```

### Using the client library to get the full cloud task if you know the name

```javascript
// Imports the Google Cloud Tasks Wrapper library.
const { CloudTaskWrapper } = require("cloud-task-wrapper");

async function quickstart() {
  // TODO(developer): Uncomment these lines and replace with your values.
  // const project = 'my-project-id';
  // const queue = 'my-appengine-queue';
  // const location = 'us-central1';

  const config = {
    project,
    location,
  };

  const wrapper = new CloudTaskWrapper(config);

  const cloudTask = await wrapper.getCloudTaskByName(name, queue); //just the name of cloud task eg: 133454565656767

  console.log(`The cloud task is - ${cloudTask}`);
}
quickstart();
```

### Using the client library to delete the cloud task if you know the name

```javascript
// Imports the Google Cloud Tasks Wrapper library.
const { CloudTaskWrapper } = require("cloud-task-wrapper");

async function quickstart() {
  // TODO(developer): Uncomment these lines and replace with your values.
  // const project = 'my-project-id';
  // const queue = 'my-appengine-queue';
  // const location = 'us-central1';

  const config = {
    project,
    location,
  };

  const wrapper = new CloudTaskWrapper(config);

  await wrapper.deleteCloudTaskByName(name, queue); //just the name of cloud task eg: 133454565656767

  console.log(`Deleted the cloud task`);
}
quickstart();
```

### Using the client library to create a cloud task - App Engine Request

```javascript
const { CloudTaskWrapper } = require("cloud-task-wrapper");

async function quickstart() {
  // TODO(developer): Uncomment these lines and replace with your values.
  // const project = 'my-project-id';
  // const queue = 'my-appengine-queue';
  // const location = 'us-central1';
  // const payload = 'hello';

  const config = {
    project,
    queue,
    location,
  };

  const wrapper = new CloudTaskWrapper(config);

  const task = {
    appEngineHttpRequest: {
      httpMethod: "POST",
      relativeUri: "/log_payload",
      body: Buffer.from(payload).toString("base64")
    },
    scheduleTime = {
      seconds: inSeconds + Date.now() / 1000, //inSeconds is the time for the task to be executed
    };
  };

  // Send create task request.
  const cloudTask = await wrapper.createCloudTask(task, queue, name); //name of cloud task is optional

  console.log(`Created task ${cloudTask}`);
}
quickstart();
```

### Using the client library to create a cloud task - Http Request

```javascript
const { CloudTaskWrapper } = require("cloud-task-wrapper");

async function quickstart() {
  // TODO(developer): Uncomment these lines and replace with your values.
  // const project = 'my-project-id';
  // const queue = 'my-appengine-queue';
  // const location = 'us-central1';
  // const payload = 'hello';

  const config = {
    project,
    location,
  };

  const wrapper = new CloudTaskWrapper(config);

  const task = {
    httpRequest: {
      httpMethod: "POST",
      url: "https://ram-sankhavaram.com",
      body: Buffer.from(payload).toString("base64"),
    },
    scheduleTime = {
      seconds: inSeconds + Date.now() / 1000, //inSeconds is the time for the task to be executed
    };
  };

  // Send create task request.
  const cloudTask = await wrapper.createCloudTask(task, queue, name); //name of cloud task is optional

  console.log(`Created task ${cloudTask}`);
}
quickstart();
```
