import database from "../database/database.js";

const BranchController = {
  async createBrand(req, res) => {
    try {
      const {
        brandName
      } = req.body;
      let brandImg = null;
      if (req.file) {
        brandImg = req.file;
      }
      const id = await database.instance.createBrand(brandName, brandImg);
      res.status(201).end(`Brand created with id ${id}`);
    } catch (e) {
      console.log(e);
      res.status(402).end(`Can't create brand, something went wrong: ${e}`);
    }
  },
  async fetchAllBrand(req, res) => {
    try {
      const result = await database.instance.fetchAllBrand();
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.status(200).end(JSON.stringify(result));
    } catch (e) {
      console.log(e);
      res.status(404).end("Not Found");
    }
  },
  async fetchBrand(req, res) => {
    try {
      const {
        id
      } = req.params;
      const result = await database.instance.fetchBrand(id);
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.status(200).end(JSON.stringify(result));
    } catch (e) {
      console.log(e);
      res.status(404).end("Brand not exist");
    }
  },

  async deleteAllBrand(req, res) => {
    try {
      await database.instance.deleteAllBrand();
      res.status(200).end("All brands deleted");
    } catch (e) {
      console.log(e);
      res.status(404).end("Failed to delete some brands, try again");
    }
  },
  async deleteBrand(req, res) => {
    try {
      const {
        id
      } = req.params;
      await database.instance.deleteBrand(id);
      res.status(200).end("Brand deleted");
    } catch (e) {
      console.log(e);
      res
        .status(404)
        .end("Can't delete brand, it's not exist or something went wrong");
    }
  },
}

export {BranchController}
