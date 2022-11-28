var express = require('express');
var router = express.Router();
const multer = require('multer')
var path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://quang123:quang123@cluster0.umb30uq.mongodb.net/');

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Wallpaper'});
});
router.get('/insert', function (req, res, next) {
    res.render('insert', {title: 'Add Wallpaper'});
});
router.get('/showWallpapers', function (req, res) {
    res.render('showWallpapers', {title: 'Show Wallpapers'})
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let ect = path.extname(file.originalname)
        cb(null, Date.now() + '-' + Math.random() + '-' + file.originalname)
    }
})

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    }
}).single('avatar')

const Wallpaper = new mongoose.Schema({
    // id: Number,
    pathImg: String,
    ngayTao: String,
    moTa: String,
    tieuDe: String,
})

var Wall = mongoose.model('Wallpaper', Wallpaper);

router.post('/insertImage', function (req, res, next) {
    upload(req, res, function (err) {
        // var idWall = req.body.id;
        var ngayTaoWall = req.body.ngayTao;
        var moTaWall = req.body.moTa;
        var tieuDeWall = req.body.tieuDe;


        var wall = new Wall({
            // id: idWall,
            ngayTao: ngayTaoWall,
            moTa: moTaWall,
            tieuDe: tieuDeWall,
            pathImg: `http://localhost:3000/image/${req.file.filename}`
        })
        wall.save().then(data => {
            if (data != null) {
                res.render('insert', {title: 'Them thong tin anh Thanh Cong'})
            } else {
                res.render('insert', {title: 'Them thong tin anh Khong Thanh cong ' + error})
            }
        });
        if (err instanceof multer.MulterError) {
            // res.render('insert', {title: err.message})
            console.log('them anh that bai')
        } else {
            console.log('them anh thanh cong')
            // res.render('insert', {title: 'upload thanh cong'})
        }
    })

})

router.get('/delete', function (req, res) {
    // const Wall = mongoose.model('Wallpaper', Wallpaper);
    Wall.deleteOne({}).then(data => {
        if (data != null) console.log("Delete thanh cong~!!!!")
    })
})

router.get('/danhSach', function (req, res) {
    Wall.find({}, function (error, result){
        res.render('showWallpapers', {
            listWall: result
        })
    })
    // Wall.find({}).then(data => {
    //     res.send(data)
    // })
})

router.get('/image/:imageName', function (req,res){
    // console.log(req.params.imageName)
    res.sendFile(path.resolve(`uploads/${req.params.imageName}`))
})

router.get('/delete/:id',async function(req,res){
   await Wall.findByIdAndDelete(req.params.id)
    res.redirect('/danhSach')
})

module.exports = router;
