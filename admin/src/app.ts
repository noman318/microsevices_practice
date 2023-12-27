import * as express from "express";

import * as cors from "cors";
import { createConnection } from "typeorm";

const app = express();
const PORT = 8000;

createConnection()
  .then((db) => {
    app.use(
      cors({
        origin: [
          "http://localhost:3000",
          "http://localhost:8080",
          "http://localhost:4200",
        ],
      })
    );

    app.listen(PORT, () => {
      console.log(`Listening to PORT of ${PORT}`);
    });
  })
  .catch((err) => console.log("ERROR: ", err));
