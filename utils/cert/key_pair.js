import fs from 'fs';
import __dirname from '../../dirname.js';


const PUB_KEY = fs.readFileSync(__dirname + '/utils/cert/id_rsa_pub.pem', 'utf-8');
const PRIV_KEY = fs.readFileSync(__dirname + '/utils/cert/id_rsa_priv.pem', 'utf-8');

export {PUB_KEY, PRIV_KEY};