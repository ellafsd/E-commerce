const router = require('express').Router();
const { sync } = require('../../config/connection');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async(req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    include: [{ model: Product }],
  })
   .then((tagData) => {
      if (!tagData) {
        res.status(404).json({ message: 'There is no tag with that id' });
        return;
      }
      res.status(200).json(tagData);
    })
   .catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/', async(req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);  // Send back the created tag and set the status to 201 (Created)
  } catch (error) {
    res.status(500).json({ error: error.message });  // Send back a 500 (Internal Server Error) status and the error message
  }
});

router.put('/:id', async(req, res) => {
  try {
    const [updatedRows] = await Tag.update(req.body, {
      where: { id: req.params.id }
    });

    if (updatedRows === 0) {   // if no rows updated
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json({ message: 'Tag updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async(req, res) => {
  try {
    // The destroy method returns the number of rows affected
    const numDeletedRows = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    // Check if any rows were deleted
    if (numDeletedRows === 0) {
        res.status(404).json({ message: 'No tag found with that id!' });
        return;
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
