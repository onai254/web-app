const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to SQLite database
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the in-memory SQLite database.');

  // Create the 'about' table
  db.run(`CREATE TABLE about (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }

    // Insert initial data
    const insertData = `INSERT INTO about (title, content) VALUES (?, ?)`;
    db.run(insertData, ["About Me", "As a passionate and results-driven DevOps Engineer, Site Reliability Engineer (SRE), and Cloud Specialist, I thrive at the intersection of development, operations, and cutting-edge technology. My work revolves around designing, implementing, and maintaining highly available, scalable, and secure systems, ensuring reliability and operational excellence."]);
    db.run(insertData, ["Skills and Expertise", "Kubernetes and Containerization, Cloud Computing, CI/CD Pipelines, Infrastructure as Code (IaC), Monitoring and Observability, Scripting and Automation, Site Reliability Engineering, Collaboration and Mentorship"]);
    db.run(insertData, ["Mission", "My goal is to create resilient, scalable, and secure systems that empower businesses to innovate faster. I strive to simplify complex challenges using technology while ensuring uptime and performance. I embrace a mindset of continuous learning, staying ahead of trends and adapting to the ever-evolving landscape of DevOps, cloud, and SRE."]);

    console.log('Table created and initial data inserted.');

    // Start the server after the table is created and data is inserted
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  });
});

app.get('/about', (req, res) => {
  db.all('SELECT * FROM about', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.post('/about', (req, res) => {
  const { title, content } = req.body;
  db.run(`INSERT INTO about (title, content) VALUES (?, ?)`, [title, content], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.redirect('/');
  });
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
    process.exit(0);
  });
});
