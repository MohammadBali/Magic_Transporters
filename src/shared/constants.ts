import dotenv from 'dotenv';
dotenv.config();

/**
 ** Sign Key Value
 ** Retrieved From environment file**/
const SignKey = process.env.SIGN_KEY || '?';


export default {SignKey}