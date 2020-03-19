const express = require('express');
const User = require('../users/userDb');
const Post = require('../posts/postDb');

const router = express.Router();

// create new user and validate body
router.post('/', validateUser, (req, res) => {
  // do your magic!
  User.insert(req.body)
    .then(add => {
      res.status(201).json(add);
    })
    .catch(err => res.status(500).json({ error: 'Could not add user' }))
});

//create new post for existing user and validate body
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const { id } = req.params;
  req.body.user_id = id;

  Post.insert(req.body)
    .then(add => {
      res.status(200).json(add);
    })
    .catch(err => res.status(500).json({ error: 'Could not add post' }))
});

router.get('/', (req, res) => {
  // do your magic!
  User.get()
    .then(retrieve => {
      res.status(200).json(retrieve);
    })
    .catch(err => res.status(500).json({ error: 'Could not get uers' }))
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  user_id = id;

  User.getUserPosts(id)
    .then(retrieve => {
      res.status(200).json(retrieve);
    })
    .catch(err => res.status(500).json({ error: 'Could not get user posts' }))
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
User.remove(req.params.id)
  .then(deleted => {
    if (deleted) {
      res.status(200).json(deleted);
    }
    else {
      res.status(404).json({ error: 'Invalid user id' });
    }
  })
  .catch(err => res.status(500).json({ error: 'server error' }))
});

router.put('/:id', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const { id } = req.params;
  req.body.user_id = id;

  Post.update(id, req.body)
    .then(updated => {
      res.status(200).json(updated);
    })
    .catch(err => res.status(500).json({ error: 'User information could not be updated' }))
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;

  User.getById(id)
    .then(check => {
      console.log('this is check id from validateID', check.id)
      console.log('this is ID from validateid', id)
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

function validateUser(req, res, next) {
  // do your magic!
  const body = req.body;
  if  (Object.keys(body).length === 0) {
    res.status(400).json({ message: 'missing user data' }); 
  }
  else if (!body.name) {
    res.status(400).json({ message: 'missing required name field' });
  }
  else { 
    next();
  }
};

function validatePost(req, res, next) {
  // do your magic!
  const body = req.body;
  if (Object.keys(body).length === 0) {
    res.status(400).json({ message: 'missing post data' });
  }
  else if(!body.text) {
    res.status(400).json({ message: 'missing required text field' });
  }
  else {
    next();
  }
};

module.exports = router;
