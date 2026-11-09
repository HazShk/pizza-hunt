const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
  console.log('📄 html-routes: someone asked for the homepage');
  res.sendFile(path.join(__dirname, '../../public/pizza-list.html'));
});

router.get('/add-pizza', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/add-pizza.html'));
});

router.get('/pizza', (req, res) => {
  console.log('📄 html-routes: someone asked for the single pizza page');
  console.log('   ...and the ticket in the address says id =', req.query.id);
  res.sendFile(path.join(__dirname, '../../public/pizza.html'));
});

module.exports = router;
