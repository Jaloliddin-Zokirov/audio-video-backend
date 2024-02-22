const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const getAllBlogs = require("./methods/GetAll");
const getLinkyId = require("./links-methods/GetByid")
const deleteLinkById = require("./links-methods/delteLink")
const updateLinkById = require("./links-methods/Update")
const getBlogById = require("./methods/GetById");
const createBlog = require("./methods/CreateBlog");
const deleteBlog = require("./methods/Delete");
const updateBlog = require("./methods/UpdateBlog");
const CreateForAudio = require("./methods-for-audio/CreateForAudio");
const getAllAudio = require("./methods-for-audio/getAllAudio");
const UpdateAudio = require("./methods-for-audio/UpdateAudio");
const Audiodelete = require("./methods-for-audio/Audiodelete");
const getBlogByIdAudios = require("./methods-for-audio/getBlogByIdAudios");
const getLogo = require("./logoApi/getLogo");
const createLogo = require("./logoApi/createLogo");
const DeleteLogo = require("./logoApi/DeleteLogo");
const  updateLogo  = require("./logoApi/UpdateLogo");
const CreateById = require("./methods-for-audio/CreateById");
const updateOneAudio = require("./methods-for-audio/updateOneAudio");
const delteInner = require("./methods-for-audio/DeleteInner");
const GetInner = require("./methods-for-audio/GetInner");
const createPhone = require('./phone-number-method/createPhoneNumber');
const getAll = require("./phone-number-method/GetAllNumber")
const getPhoneById = require("./phone-number-method/GetByid")
const updatePhoneById = require("./phone-number-method/Update")
const deletePhoneById = require("./phone-number-method/deletePhone");
const deleteAllFilesFromUploadsFolder = require("./helpers");
const updateOneLink = require("./methods-for-audio/UpdataOneLink");
const CreateLink = require("./links-methods/CreateLink");
const GetAllLinks = require("./links-methods/GetAllLinks");
const UpdateById = require("./methods-for-audio/updateOneAudio");
const DeleteAudioById = require("./methods-for-audio/UpdateAudio");
const CreateBlog = require("./methods/CreateBlog");
const getAdmin = require("./Admin/getAdmin");
const Admin  = require("./model/admin");
const delteAdmin = require("./Admin/delteAdmin");
const login = require("./Admin/login");
const UpdateAdmin = require("./Admin/update")
const SendConfirmationNumber = require("./Admin/forgotPadd")
const confirmConfirmationCode = require("./Admin/Confirm")
const CreateCusmtomers = require("./Customers/Create")
const GetCuustomer = require("./Customers/GetCustomers")
const DeleteCustomer = require("./Customers/DeleteCustomers");
const loginCustomers = require("./Customers/loginCustomers");


const PORT = process.env.PORT || 5001;
const url = "mongodb+srv://abduxalilovjavohir393:1984god123@cluster0.uifiguj.mongodb.net/?retryWrites=true&w=majority";
// Connect to MongoDB
const app = express();
deleteAllFilesFromUploadsFolder()
async function connect() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 40000, // 30 seconds timeout
  socketTimeoutMS: 45000,
      
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connect();



// Multer configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const LogoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads-logo/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "audio-uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "audio-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "video-uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "video-" + uniqueSuffix + path.extname(file.originalname));
  },
});


const uploadVideo = multer({ storage: videoStorage, limits: { fileSize: 100000000 } });
const uploadImage = multer({ storage });
const uploadLogo = multer({ storage: LogoStorage });
const uploadSmallAudio = multer({ storage: audioStorage, limits: { fileSize: 100000000 }}).fields([
  { name: 'ru_smallaudio', maxCount: 1 },
  { name: 'ru_image', maxCount: 1 },
  { name: 'ru_video', maxCount: 1 },
])

app.post("/api/audios", uploadSmallAudio, CreateForAudio);

const uploadAudio = multer({ storage: audioStorage, limits: { fileSize: 100000000 } });


app.use(cors({
  origin: ["http://localhost:3001","https://audiovideo-test.netlify.app","http://localhost:3000", "https://admin-paneltest.netlify.app","https://mq5nyl-3000.csb.app","https://ghqrs5-3000.csb.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"] 
}));

app.use(express.json());

// Routes
app.get("/api/hero", getAllBlogs);
app.get("/api/hero/:id", getBlogById);
app.post("/api/hero", uploadImage.single("image"), CreateBlog);
app.delete("/api/hero/:id", deleteBlog);
app.put("/api/hero/:id", uploadImage.single("image"), updateBlog);

const upload = multer();

app.get("/api/audios", getAllAudio);
app.get("/api/audios/:id", getBlogByIdAudios);
app.get("/api/audios/:id/:id2", GetInner);
app.post("/api/audios/:id", uploadAudio.fields([{ name: 'audio' }]), CreateById);
app.post("/api/audios", uploadSmallAudio, (req, res, next) => {
  next();
}, CreateForAudio);
app.put("/api/audios/:id", uploadSmallAudio, (req, res, next) => {
  next();
}, UpdateAudio);
app.put("/api/audios/:id/:id2", uploadAudio.fields([{ name: 'audio' }]), UpdateById);
app.put("/api/audios/:id/:id2/:id3",updateOneLink);
app.delete("/api/audios/:id", Audiodelete);
app.delete("/api/audios/:id/:id2", delteInner);

// Logo
app.get("/api/logo", getLogo);
app.post("/api/logo", uploadLogo.fields([{ name: 'dark' },{ name: 'light' }]), createLogo);
app.delete("/api/logo/:id", DeleteLogo);
app.put("/api/logo/:id", uploadLogo.fields([{ name: 'dark' },{ name: 'light' }]), updateLogo);

// Number
app.post('/api/phone-number', createPhone);
app.get('/api/phone-number', getAll);
app.get('/api/phone-number/:id', getPhoneById);
app.put('/api/phone-number/:id', updatePhoneById);
app.delete('/api/phone-number/:id', deletePhoneById);

// Links
app.post('/api/links', CreateLink);
app.get('/api/links', GetAllLinks);
app.get('/api/links/:id', getLinkyId);
app.put('/api/links/:id', updateLinkById);
app.delete('/api/links/:id', deleteLinkById);

// Admin
app.get("/api/admin",getAdmin)
app.delete("/api/admin/:id",delteAdmin)
app.post("/api/admin",login)
app.put("/api/admin/:id",uploadImage.single("image"), UpdateAdmin)
app.post("/api/admin/confirm",SendConfirmationNumber)
app.post("/api/admin/confirmation",confirmConfirmationCode)


// Customers
app.get("/api/customers",GetCuustomer)
app.delete("/api/customers/:id",DeleteCustomer)
app.post("/api/customers/",CreateCusmtomers)
app.post("/api/customers/login",loginCustomers)



// Static file serving
app.use("/uploads", express.static("uploads"));
app.use("/uploads-logo", express.static("uploads-logo"));
app.use("/audio-uploads", express.static("audio-uploads"));

// Request logging middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});

// Handle SIGINT signalxop 
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});


