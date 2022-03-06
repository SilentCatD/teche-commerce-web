const mongoose  = require('mongoose')

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "TEST_COMPANY",
    required: true,
  },
  img: String,
})

module.exports = mongoose.model("Branch",branchSchema)
