const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

const models = require("./models");
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const middleware = require("./middleware/middleware")
const route = express.Router();

const corsConfig = {
  origin: "*",
};

app.use(cors(corsConfig));

route.use(middleware)

app.post("/registerUser", (req, res) => {
  const user = models.user.build({
    fullname: req.body.fullname,
    password: req.body.password,
    email: req.body.email,
  });
  user.save().then((result) => {
    if (result) {
      res.status(200).send({
        status: true,
        data: req.body,
        message: "Insert Data Successfully",
      });
    }
  });
});

app.post("/login", (req, res) => {
  let {email,password} = req.body;
  models.user.findOne({
    where:{
      email:email,
      password:password
    }
  }).then(result=>{
    if(result){
      const token = jwt.sign(
        { userId: result.id, email: result.email },
        "secretkeyappearshere",
        { expiresIn: "1h" })
        if(token){
          res.status(200).send({
            status:true,
            message:'Login Sucessesfull!',
            token:token
          })
        }
        else{
          res.status(200).send({
            status:false,
            message:'Please check your credential'
          })
        }
    }
    else{
      res.status(404).send({
        status:false,
        message:'Invalid username and password',
      })
    }
  })
});



route.get("/", (req, res) => {
  models.user.findAll().then((users) => {
    res.status(200).send({
      status: true,
      data: users,
    });
  });
});


route.get("/getUserById/:id", (req, res) => {
  models.user
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((result) => {
      if (result) {
        res.status(200).send({
          status: true,
          data: result,
        });
      } else {
        res.status(200).send({
          status: false,
          data: result,
          message: "user not found",
        });
      }
    });
});

route.get("/getUserDeleteById/:id", (req, res) => {
  models.user
    .destroy({
      where: {
        id: req.params.id,
      },
    })
    .then((result) => {
      if (result) {
        res.status(200).send({
          status: true,
          message: "user delete sucessesfully!",
        });
      } else {
        res.status(200).send({
          status: false,
          message: "user not found",
        });
      }
    });
});

route.post("/userUpdate/:id", (req, res) => {
  models.user
    .update(
      {
        fullname: req.body.fullname,
        password: req.body.password,
        email: req.body.email,
      },
      { where: { id: req.params.id } }
    )
    .then((result) => {
      if (result != 0) {
        res.status(200).send({
          status: true,
          message: "User Update Sucessesfully!",
        });
      } else {
        res.status(200).send({
          status: false,
          message: "User not found",
        });
      }
    });
});

app.use("/",route)

app.listen(3000, () => {
  console.log("Sever is now listening at port 3000");
});
