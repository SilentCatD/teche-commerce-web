import database from "../database/database.js";

async function getImgStream(req, res) {
    try {
        const { id } = req.params;
        let imgStream = await database.instance.fetchImageFileStream(id);
        imgStream.pipe(res);
    } catch (e) {
        res.status(404).end("Image not found");
    }
}

export { getImgStream };
