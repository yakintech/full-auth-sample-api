const { User } = require("../models/User");
const { confirmCodeEmail } = require("../utils/emailService");
var jwt = require('jsonwebtoken');
var moment = require('moment')

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
                    user.codeExpire = moment().add(20, 'seconds');

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

      
        User.findOne({ email: req.body.email.toLowerCase()})
            .then(data => {
           
                if (data) {

                    if(data.code == req.body.code){
                        if(data.codeCounter > 0 && moment(data.codeExpire) > moment()){
                            data.codeCounter = 3;
                            data.isActive = true;
                            data.save();
    
                            let token = jwt.sign(req.body.email,privateKey);
                            res.json({token: token })
                        }
                        else{
                            res.status(500).json({"message":"Code counter or code expire error!"})
                        }
                    }
                    else{
                        data.codeCounter = data.codeCounter - 1;
                        data.save();
                        res.status(500).json({"message":"Code wrong!"})
                    }
                }
                else {
                    res.status(500).json({ "msg": "Confirm Code error" })
                }
            })
            .catch(err => {
                console.log('Err', err);
                res.status(500).send("Mongo error!")
            })
    },
    login: (req, res) => {



        User.findOne({ email: req.body.email?.toLowerCase(), password: req.body.password, isActive:true })
            .then(data => {
                if (data) {
           
                    var randomCode = Math.floor(Math.random() * 10000);
                    data.code = randomCode;
                   

                    confirmCodeEmail(req.body.email, randomCode);
                    data.codeExpire = moment().add(20, 'seconds');
                    data.save();
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