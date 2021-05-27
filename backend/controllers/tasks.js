

const Task = require('../models/task');



exports.createTask =
(req, res, next) => {
 const url = req.protocol + '://' + req.get("host");
 const task = new Task({
   title: req.body.title,
   content: req.body.content,
   imagePath: url + "/images/" + req.file.filename,
   creator: req.userData.userId
 });

 task.save().then(createdTask => {
   res.status(201).json({
     message: 'Task Added Succesfully',
     task: {
       ...createdTask,
       id: createdTask._id,
       // title: createdTask.title,
       // content: createdTask.content,
       // imagePath: createdTask.imagePath,
     }
   });
 }).catch( error => {
   res.status(500).json({
     message: "Creating a task failed!"
   });
 });
}

exports.editTask =
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
  imagePath: imagePath,
  creator: req.userData.userId
});
Task.updateOne({_id: req.params.id, creator:req.userData.userId }, task ).then(result => {
  if (result.nModified > 0) {
    res.status(200).json({message:"Update successful"});
  } else{
    res.status(401).json({message:"Not authorized!"});
  }
})
.catch(error => {
  res.status(500).json({
    message: "Couldn't update task!"
  })
});
}

exports.getTasks = (req, res, next) =>{
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
  .catch( error => {
    res.status(500).json({
      message: "Fetching tasks failed!"
    });
  })
 }

 exports.getTaskById = (req, res, next) => {
  Task.findById(req.params.id).then( task => {
    if (task) {
           res.status(200).json(task);
    } else {
      res.status(404).json({message: 'Task not found'});
    }
  })
  .catch( error => {
    res.status(500).json({
      message: "Fetching tasks failed!"
    });
  });
}

exports.deleteTask = (req, res, next) =>{
  Task.deleteOne({_id: req.params.id, creator:req.userData.userId}).then(result => {
    if (result.n > 0) {
      console.log(result);
      res.status(200).json({message:"Deletion successful"});
    } else {
      res.status(401).json({message:"Not  authorized!"});
    }
  }).catch( error => {
    res.status(500).json({
      message: "Fetching tasks failed!"
    });
});
}
