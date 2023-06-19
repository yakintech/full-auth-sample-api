const { User } = require("../models/User");
const { confirmCodeEmail } = require("../utils/emailService");
var jwt = require('jsonwebtoken');

let privateKey = "lambofgod";

const userController = {


    register: (req, res) => {
        //Öncelikle kullanıcının gönderdiği email e bakıp db olup olmadığını kontrol ediyorum

        User.findOne({ email: req.body.email })
            .then(data => {
                if (!data) {
                    //Bir adet random code üretip DB YE BASIYORUM! Bu confirm code kullanıcıya email olarak da gidecek

                    var randomCode = Math.floor(Math.random() * 10000);

                    //Ürettiğim random code email olarak kullanıcıya atıyorum (endpointte email validation olmalı!)
                    confirmCodeEmail(req.body.email, randomCode)

                    var user = new User({
                        email: req.body.email,
                        password: req.body.password,
                        code: randomCode
                    });

                    user.save()
                        .then(saveRes => {
                            res.json(saveRes)
                        })
                        .catch(err => {
                            res.status(500).json(err)
                        })
                }
                else {
                    res.json({ "msg": "Bu email sisteme kayıtlı!" })
                }
            })

    },
    confirmCode: (req, res) => {

        console.log('BODY', req.body);
        User.findOne({ email: req.body.email.toLowerCase(), code: req.body.code })
            .then(data => {
                if (data) {

                    let token = jwt.sign(req.body.email,privateKey);
                    console.log('TOKEN', token);
                    res.json({token: token })
                }
                else {
                    res.status(500).json({ "msg": "Confirm Code error" })
                }
            })
            .catch(err => {
                res.status(500).send("Mongo error!")
            })
    },
    login: (req, res) => {

        User.findOne({ email: req.body.email?.toLowerCase(), password: req.body.password })
            .then(data => {
                if (data) {
                    console.log('OK!');
                    var randomCode = Math.floor(Math.random() * 10000);
                    data.code = randomCode;
                    data.save();

                    confirmCodeEmail(req.body.email, randomCode);
                    res.json({ email: req.body.email })

                }
                else {
                    res.status(404).json({ "msg": "Email or password error" })
                }
            })

    },
    forgotPassword: (req, res) => {
        User.findOne({ email: req.body.email })
            .then(data => {
                if (data) {

                    var randomCode = Math.floor(Math.random() * 10000);
                    data.code = randomCode;
                    data.save();

                    confirmCodeEmail(req.body.email, randomCode);
                    res.json({ email: req.body.email })

                }
                else {
                    res.status(404).json({ "msg": "Email error" })
                }
            })
    },
    newPassword: (req, res) => {

        User.findOne({ email: req.body.email })
            .then(data => {

                if (data) {
                    data.password = req.body.password;
                    data.save();
                    res.json({ email: req.body.email })
                } {
                    res.status(404).json({ "msg": "Not found!" })
                }

            })
            .catch(err => {
                res.status(500).json(err)
            })

    }

}


module.exports = {
    userController
}


//kullanıcı şifremi unuttum diyip email girdikten sonra 1 dk içerisinde code girmek zorunda!

//3 den fazla kodu yanlış giremez!