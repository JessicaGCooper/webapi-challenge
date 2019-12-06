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

//actions get
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
router.post('/', (req, res) => {
  
});

//actions post
router.post('/:id/actions', (req, res) => {
 
});


//PUT
router.put('/:id', (req, res) => {
  
});

//DELETE
router.delete('/:id', (req, res) => {
  
});


//custom middleware

function validateProjectId(req, res, next) {
    // do your magic!
    const id = req.params.id;
    console.log(id);
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
    // do your magic!
    const project_id = req.params.id;
    console.log(project_id);
    projectsDB.get(project_id)
      .then(project => {
        if (project) {
        //   req.project = project;
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

  module.exports = router;