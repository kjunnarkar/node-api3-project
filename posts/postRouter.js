const express = require('express');
const Post = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  Post.get()
    .then(retrieve => {
      if (retrieve) {
        res.status(200).json(retrieve);
      }
    })
    .catch(err => res.status(500).json ({ error: 'User information could not be retrieved' }))
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  Post.remove(req.params.id)
    .then(deleted => {
      res.status(200).json(deleted);
    })
    .catch(err => res.status(500).json({ error: 'server error' }))
});

router.put('/:id', validatePostId, validatePut, (req, res) => {
  // do your magic!
  const { id } = req.params;
  //req.body.user_id = id;

  Post.update(id, req.body)
    .then(updated => {
      if (updated > 0) {
        res.status(200).json(updated);
      }
      else {
        res.status(404).json({ error: 'The user information could not be found' })
      }
    })
    .catch(err => res.status(500).json({ error: 'The user information could not be updated' }))
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params;

  Post.getById(id)
    .then(check => {
      if (check) {
        req.user = check;
        next();
      }
      else {
        req.status(404).json({ message: 'invalid user id' }); // no catch
      }
    })
    .catch(err => res.status(500).json({ error: 'server error' }))
}

function validatePut(req, res, next) {
  // do your magic!
  const body = req.body;
  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: 'missing put data' });
  }
  else if(!body.text) {
    res.status(400).json({ message: 'missing required text field' });
  }
  else {
    next();
  }
};

module.exports = router;
