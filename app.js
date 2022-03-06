const THIS_IS_PASSWORD_HACKER_CANT_HANDLE_THIS = "admin"

const express = require("express")
const bodyParser = require("body-parser")

const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.set('view engine', 'ejs')


const mongoose = require('mongoose')
const Branch = require('./api/model/branch')


const clientReceiveMsg = {
  dbsMsg: "",
  serverMsg: ""
}

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running port: 3000");
})



// Connect to mongo atlas database and define simple function add and delete single recored
mongoose.connect(
  "mongodb+srv://rabittanktoei:" + THIS_IS_PASSWORD_HACKER_CANT_HANDLE_THIS + "@thisisfortestpurpose.3mdrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
  },
  () => {
    console.log("Database maybe connected, i don't sure")
  },
  e => console.error(e)
)


async function add(comany_name, url_img) {

  const new_branch = new Branch({
    name: comany_name,
    img: url_img
  })
  await new_branch.save().then(() => {
      console.log("New Branch have been added to database")
      clientReceiveMsg.dbsMsg = "💘 BANG 💘"
    })
    .catch(err => {
      console.error(err)
      clientReceiveMsg.dbsMsg = err
    })

  // // NOTE: YOU CAN USING SHOTER VERSION ( NOT REALLY :) )
  // const new_branch = await branch.create({
  //   name:comany_name,
  //   img:url_img
  // })
}

async function deleteCompany(comany_name) {

  // NOTE: collection.remove is deprecated, i just putting there for more KPI

  // await Branch.remove({
  //   name: comany_name
  // }).exec().then(msg => {
  //   console.log(msg)
  //   clientReceiveMsg.dbsMsg ="💔 BANG 💔"
  // }).catch(e => {
  //   console.error(e)
  //   clientReceiveMsg.dbsMsg = e
  // })

  await Branch.deleteOne({
    name: {
      $eq: comany_name
    }
  }).then(msg => {
    console.log(msg)
    clientReceiveMsg.dbsMsg = " deletedCount: " + msg.deletedCount
  }).catch(e => {
    console.error(e);
    clientReceiveMsg.dbsMsg = e
  })

}


// hanele route and user input

app.get("/", function(req, res) {
  res.render("admin-controller", {
    dbsResponse: clientReceiveMsg.dbsMsg
  })
})



app.post("/addCompany", function(req, res) {

  const company_name = req.body.cName
  const url_img = req.body.cImg

  add(company_name, url_img)

  res.redirect("/")
})

app.post("/delCompany", function(req, res) {
  const company_name = req.body.cName

  deleteCompany(company_name)

  res.redirect("/")
})

app.get("/branch", async function(req,res){

  const branchs = await Branch.find()

  console.log(branchs)

  res.json(branchs)
})
