const express = require('express');
const router = express.Router();

const Posts = require('./data/db.js');

router.post('/', (req, res) => {
  const { title, contents } = req.body;

  if (!title && !contents) {
    req.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
  }

  Posts.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({
        error: 'There was an error while saving the post to the database'
      });
    });
});

router.post('/:id/comments', (req, res) => {
  const { text } = req.body;

  if (!text) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide text for the comment.' });
  }

  Posts.findById(req.params.id)
    .then(post => {
      if (post) {
        Posts.insertComment(req.body)
          .then(comment => {
            res.status(201).json(comment);
          })
          .catch(err => {
            res.status(500).json({
              error:
                'There was an error while saving the comment to the database'
            });
          });
      }
    })
    .catch(err => {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    });
});

router.get('/', (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved' });
    });
});

router.get('/:id', (req, res) => {
  Posts.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json({ post });
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: 'The post information could not be retrieved.' });
    });
});

router.get('/:id/comments', (req, res) => {
  Posts.findPostComments(req.params.id)
    .then(comments => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved.' });
    });
});

router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'The post could not be removed' });
    });
});

router.put('/:id', (req, res) => {
  const { title, contents } = req.body;

  if (!title && !contents) {
    res
      .status(400)
      .json({ message: 'Please provide title and contents for post.' });
  }

  Posts.update(req.params.id, req.body).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist' });
    }
  });
});

module.exports = router;
