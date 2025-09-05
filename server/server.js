@@ .. @@
 const express = require('express');
+const cors = require('cors');
 const swaggerDocs = require("./swagger.js");
 const app = express();
 const morgan = require("morgan");
@@ .. @@
 const connectToDb = require('./db/connection');
 connectToDb();

+// CORS configuration
+app.use(cors({
+  origin: ['http://localhost:5173', 'http://localhost:3000'],
+  credentials: true
+}));
+
 app.get('/', (req, res) => {
   res.send('Hello World!');
 });