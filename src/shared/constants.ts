import dotenv from 'dotenv';

dotenv.config();

const SignKey = process.env.SIGN_KEY || '?';


export default {SignKey}