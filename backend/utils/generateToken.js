import jwt from 'jsonwebtoken';  // Use import instead of require

const generateToken = (id) => {
    const accessToken = jwt.sign({id}, process.env.SECRET, {
        expiresIn: '2h',
    });
    return accessToken;
};

const setCookies = (res, accessToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 15 * 1000   // 15 hrs
    });
};

export { generateToken, setCookies };  // Use export for named exports
