const { User } = require("../models/User");
const { confirmCodeEmail } = require("../utils/emailService");


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
    confirmCode: (req,res) => {

        User.findOne({email:req.body.email, code: req.body.code})
        .then(data => {
            if(data){
                res.json({email: req.body.email})
            }
            else{
                res.status(404).json({"msg": "Confirm Code error"})
            }
        })
        .catch(err => {
            res.status(500).send("Mongo error!")
        })
    },
    login: (req,res) => {

        User.findOne({email: req.body.email, password:req.body.password})
        .then(data =>{
            if(data){

                var randomCode = Math.floor(Math.random() * 10000);
                data.code = randomCode;
                data.save();

                confirmCodeEmail(req.body.email, randomCode);
                res.json({email: req.body.email})

            }
            else{
                res.status(404).json({"msg":"Email or password error"})
            }
        })

    }

}


module.exports = {
    userController
}