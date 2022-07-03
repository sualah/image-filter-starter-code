import  express, {Request,Response}  from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  const app = express();

  const port = process.env.PORT || 8082;

  app.use(bodyParser.json());

  app.get(
    "/filteredimage",
    async (req: Request, res: Response) => {
      let  image_url  = req.query.image_url as string;
      if (!image_url) {
        res.status(400).send("Error: The submitted url is empty");
      } else {
        await filterImageFromURL(image_url)
          .then(function (image_filtered_path) {
            res.sendFile(image_filtered_path, () => {
              deleteLocalFiles([image_filtered_path]);
            });
          })
          .catch(function (err) {
            res
              .status(400)
              .send(
                "Error:" +
                  err +
                  "For some reason the image cannot be filtered. Please provide the following ID to our support:" +
                  Math.random().toString(36).substr(2, 9)
              );
          });
      }
    }
  );

  app.get("/", async (req: express.Request, res: express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
