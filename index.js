const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const formSchema = new mongoose.Schema({
  name: String,
  twitter: String,
  email: String,
  chuts: {
    type: Number,
    max: 3
  },
  headers: Object,
  userAgent: String,
  ip: String
});

const Form = mongoose.model("Form", formSchema);

app.post("/api/submit", async (req, res) => {
  const { name, twitter, email, chuts } = req.body;
  if (!name || !twitter || !email || chuts > 3) {
    return res.status(400).json({ message: "Validation failed" });
  }
console.log(req)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  const newForm = new Form({
    name,
    twitter,
    email,
    chuts,
    headers: req.headers,
    userAgent,
    ip
  });

  try {
    await newForm.save();
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
