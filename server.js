const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const xlsx = require('xlsx');
const { TeamMember } = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Memory storage for multer
const upload = multer({ storage: multer.memoryStorage() });

app.post('/team', async (req, res) => {
  try {
    const { name, phone, address, license, service } = req.body;
    const teamMember = await TeamMember.create({ name, phone, address, license, service });
    res.status(201).json(teamMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/team', async (req, res) => {
  try {
    const teamMembers = await TeamMember.findAll();
    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const teamMembers = await Promise.all(data.map(async (item) => {
      const { name, phone, address, license, service } = item;
      return TeamMember.create({ name, phone, address, license, service });
    }));

    res.status(201).json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});