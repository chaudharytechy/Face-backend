import JWT from 'jsonwebtoken';

const authentication = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
console.log(token,"token")
    if (!token) {
      return res.status(401).json({ message: 'No token found, access denied!' });
    }

    const decoded = JWT.verify(token,'yourSecretKey');
console.log(decoded,"dec")
    req.user = decoded; // attach user info to request object
    

    next(); // proceed to the next middleware or route handler
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: 'Invalid or expired token!' }); 
  }
};

export default authentication;
