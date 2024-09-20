const express = require("express");
const bodyParse = require("body-parser");

const port = 3333;

const app = express();
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));

require("./controllers/authController")(app);
require("./controllers/users")(app);

app.listen(port, () => console.log(`api rodando na porta ${port}`));
