const express = require('express');
const projectsDB = require('../../data/helpers/projectModel')
const actionsDB = require('../../data/helpers/actionModel.js')

const router = express.Router();


//projects list get
router.get('/', (req, res) => {

  projectsDB.get()
  .then(projects => {
     res
     .status(200)
     .json({projects})
  })
  .catch(error => {
    res
    .status(500)
    .json({ message: "The project list could not be retrieved from the database.", error})
  })
});

//projects get by id
router.get('/:id', validateProjectId, (req, res) => {
  const id = req.params.id

  projectsDB.get(id)
  .then(project => {
    res
    .status(200)
    .json(project)
  })
  .catch(error => {
    res
    .status(500)
    .json({ message: "The server could not retrieve the project with the specified ID from the database", error})
  })
});

//project actions list get
router.get('/:id/actions', validateActionsProjectId, (req, res) => {
    const project_id = req.params.id

    projectsDB.getProjectActions(project_id)
    .then(actions => {
      res
      .status(200)
      .json(actions)
    })
    .catch(error => {
      res
      .status(500)
      .json({ message: "The server could not retrieve the Actions List from the database", error})
    })
});

//POSTS
//projects post
router.post('/', validateProjectInfo, (req, res) => {
    projectsDB.insert(req.body)
    .then(projectInfo => {
        res
        .status(201)
        .json(projectInfo)
    })
    .catch(error => {
        res
        .status(500)
        .json({ message: "There was an error while saving the project to the database", error})
    })
});

//actions post
router.post('/:id/actions', validateActionsProjectId, validateActionInfo, (req, res) => {
    
    if (req.body.description.length < 1 || req.body.description.length > 128){
        res
        .status(400)
        .json({ message: "The description must be greater than 0 and less than 129 characters long"})
    } else {
        actionsDB.insert(req.body)
        .then(projectInfo => {
            res
            .status(201)
            .json(projectInfo)
        })
        .catch(error => {
            res
            .status(500)
            .json({ message: "There was an error while saving the action to the database", error})
        })
    }
});

//PUT
router.put('/:id', validateProjectId, validateProjectInfo, (req, res) => {
  const id = req.params.id
    
  projectsDB.update(id, req.body)
    .then(projectUpdate => {
        res
        .status(200)
        .json(projectUpdate)
    })
    .catch(error => {
        res
        .status(500)
        .json({ message: "There was an error while modifying the project in the database", error})
    })
});

//DELETE
router.delete('/:id', validateProjectId, (req, res) => {
  const id = req.params.id

  projectsDB.get(id)
    .then(project => {
        projectsDB.remove(id)
            .then(removedProject => {
               if(removedProject === 1){ 
                res
                .status(200)
                .json({message: `The project with ID number ${id} has been successfully removed.`, project})
               } else {
                 res
                 .status(406)
                 .json({ message: "The server returned and incorrect response."})
               }
            })
            .catch(error => {
                res
                .status(500)
                .json({ message: "The server could not successfully delete the project.", error})
            })
    });
});


//custom middleware

function validateProjectId(req, res, next) {
    const id = req.params.id;
    
    projectsDB.get(id)
      .then(project => {
        if (project) {
          req.project = project;
          next();
        } else {
          res
          .status(404)
          .json({error: 'No project with the specified ID exists.'});
        }
      })
      .catch(error => {
        console.log(error);
        res
        .status(500)
        .json({error: 'Server error validating project ID'});
      })
  } 

  function validateActionsProjectId(req, res, next) {
    const project_id = req.params.id;
    
    projectsDB.get(project_id)
      .then(project => {
        if (project) {
          next();
        } else {
          res
          .status(404)
          .json({error: 'No project with the specified project_id exists.'});
        }
      })
      .catch(error => {
        console.log(error);
        res
        .status(500)
        .json({error: 'Server error validating project_id.'});
      })
  } 

function validateProjectInfo(req, res, next){
    const { name, description, completed } = req.body;
  
    if (!name || !description) {
      res
        .status(400)
        .json({ message: "Please provide a name and description for the project." });
    } else {
      next();
    }
  };

  function validateActionInfo(req, res, next){
    const { project_id, description, notes, completed } = req.body;
  
    if (!project_id || !description || !notes ) {
      res
        .status(400)
        .json({ message: "Please provide a project_id, description, and notes for the action." });
    } else {
      next();
    }
  };

  module.exports = router;