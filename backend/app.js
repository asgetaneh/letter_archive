const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors'); // Import the CORS package
const outboxRoutes = require('./routes/outbox');
const letterRoutes = require('./routes/letterRoutes');
const memoRoutes = require('./routes/memoRoutes');
const user = require('./routes/user'); // Import user routes
const retentionPolicyRoutes = require('./routes/retentionPolicy');

const path = require("path");

const admin = require("firebase-admin");
// Load Firebase service account key
const serviceAccountPath = path.join(__dirname, "firebase-service-account.json");

// admin.initializeApp({
//   credential: admin.credential.cert(require(serviceAccountPath)),
// });

app.use(cors({
  origin: 'http://localhost:3001', // or whatever port your React app is on
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
 app.use(express.json());

const upload = require('./routes/upload');
const dbConfig = require('./config/dbConfig');

dotenv.config();
 

// Use letter routes
app.use(letterRoutes); // Use your route here
app.use('/api/outbox', outboxRoutes);
app.use(memoRoutes);
app.use(user);
app.use('/api/user-groups', require('./routes/userGroups'));
app.use('/api/user-roles', require('./routes/userRoles'));
app.use('/uploads', express.static('uploads'));
app.use('/', upload);
app.use('/api/retention-policies', retentionPolicyRoutes);


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
