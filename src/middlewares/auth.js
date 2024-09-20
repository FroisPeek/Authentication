const jwt = require("jsonwebtoken");
const authConifg = require("../config/auth.json");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // caso nao encontre token
  if (!authHeader) return res.status(401).send({ error: "No token provided" });

  const parts = authHeader.split(" ");

  // caso falhe algo relacionado a formação do token
  if (!parts.length === 2)
    return res.status(401).send({ error: "Token error" });

  const [scheme, token] = parts;

  // Mal formação novamente
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Token malformatted" });

  jwt.verify(token, authConifg.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token invalid" });

    req.userId = decoded.id;
    return next();
  });
};

// quando for testar o middleware, coloco um 'Bearer' antes de informar seu token para que
// siga o padrão JWT
