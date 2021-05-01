const express = require("express");
const multer = require("multer");

const Task = require('../models/task');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");

  },
   filename: (req, file, cb) => {
   const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const task = new Task({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  task.save().then(createdTask => {
    res.status(201).json({
      message: 'Task Added Succesfully',
      task: {
        id: createdTask._id,
        title: createdTask.title,
        content: createdTask.content,
        imagePath: createdTask.imagePath,

      }
    });
  });
});

router.put(
  "/:id",
  multer({storage: storage}).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const task = new Task({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Task.updateOne({_id: req.params.id }, task ).then(result => {
    console.log(result);
    res.status(200).json({message:"update successful"});
  });
});

router.get("", (req, res, next) =>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const taskQuery = Task.find();
  let fetchedTasks;
  if (pageSize && currentPage) {
    taskQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  };
  taskQuery.then( documents => { //chained thens
    fetchedTasks = documents;
    return Task.count();
  }).then( count => {
     res.status(200).json({
      message: 'tasks fetched successfuly',
      tasks: fetchedTasks,
      maxTasks: count
    });
  })
 });


router.get('/:id', (req, res, next) =>{
  Task.findById(req.params.id).then( task => {
    if (task) {
           res.status(200).json(task);
    } else {
      res.status(404).json({message: 'Task not found'});
    }
  });
});

router.delete('/:id',  (req, res, next) =>{
  Task.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({ message: "Task deleted!"});

});

module.exports = router;
