import { configType } from "../type";


const getRequired = (name: string) => {
  const v = process.env[name];

  if (!v) {
    throw new Error(`Missing env var: ${name}`);
  } 

  return v;
};


export const CONFIG: configType = {
    COSMOS_ENDPOINT: getRequired('COSMOS_ENDPOINT'),
    COSMOS_KEY: getRequired('COSMOS_KEY'),
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    PORT: Number(process.env.USER_PORT || 3002),
};
