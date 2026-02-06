import { TokenDecode } from "../utility/tokenUtility.js";

const AuthMiddleware = async (req, res, next) => {
  let token = req.cookies["token"];

  let decoded = TokenDecode(token);
  req.user = decoded;

  if (decoded === null) {
    res.status(401).send({
      status: "fail",
      message: "You are not authorized. Please log in first.",
    });
  } else {
    // email,user_id pick from decoded token
    let email = decoded.email;
    let user_id = decoded.user_id;

    // email,user_id add with request header
    req.headers.email = email;
    req.headers.user_id = user_id;

    next();
  }
};

export default AuthMiddleware;
