const express = require("express");

const TaskController = require("../controllers/tasks.js");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();



router.post("",
checkAuth,
extractFile,
TaskController.createTask
);

router.put(
  "/:id",
  checkAuth,
  extractFile,
  TaskController.editTask
  );

router.get(
  "",
  TaskController.
  getTasks);

router.get('/:id', TaskController.getTaskById);

router.delete('/:id', checkAuth, TaskController.deleteTask);

module.exports = router;
