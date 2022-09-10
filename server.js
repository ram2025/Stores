const express = require('express');
const multer = require('multer');
const path = require('path');
var bodyParser = require('body-parser');

const mongoose = require('mongoose');
const { name } = require('ejs');
const DB = 'mongodb+srv://sky:sky@cluster0.de1mtdi.mongodb.net/todo?retryWrites=true&w=majority';
mongoose.connect(DB).then(() => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
});

let uploadSchema = mongoose.Schema({
    shopname: String,
    shopimg: String,
    about: String,
    location: String,
    gallary: Array,
});

let DataUpload = mongoose.model("DataUpload", uploadSchema, "images");


const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });
const multipleUpload = upload.fields([{ name: "file1" }, { name: "file2", maxCount: 10 }]);
app.get('/', async(req, res) => {
    const stores = await DataUpload.find({});
    res.render('./index.ejs', { stores: stores });
});
app.get('/addshop', (req, res) => {
    res.render('./addshop.ejs', {});
});
app.post('/upload', multipleUpload, async(req, res) => {
    let images = [];
    if (req.files) {
        const ff = req.files.file2;
        ff.forEach((el) => {
            images.push(el.filename);
        });
        const add = new DataUpload({
            shopname: req.body.shopname,
            shopimg: req.files.file1[0].filename,
            about: req.body.about,
            location: req.body.location,
            gallary: images,
        });
        add.save();

    }
    res.redirect("/");
});

app.get('/shop/:name', async(req, res) => {
    const shop = await DataUpload.findOne({ shopimg: req.params.name.slice(1) });
    res.render('./shop.ejs', { store: shop });
});

const port = process.env.PORT || 4500;
app.listen(port);