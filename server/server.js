const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const initializePassport = require("./config/passport-setup");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const campaignRoutes = require("./routes/campaignRoutes"); 
const cloudinary = require("cloudinary").v2;
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("./config/passport-setup");

dotenv.config();
const PORT = process.env.BACKEND_URL;

const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//"
//MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
  expires: 1 * 60 * 60,
});

// Middleware setup

app.use(credentials);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Session setup
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    },
  })
);

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/api/verify", userRoutes);
app.use("/api/campaigns", campaignRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Is 🏃‍♂️ On PORT ${PORT}`));
  })
  .catch((err) => console.log(err));
