import { cert, initializeApp } from 'firebase-admin/app';
import fs from 'fs';
import 'dotenv/config';

function getCert() {
  try {
    return cert(JSON.parse(fs.readFileSync('./service-account.json', 'utf8')));
  } catch {
    console.log("Failed to load service-account.json from file");
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT) {
    return cert(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT));
  }

  throw Error("Missing Google Service Account");
}

initializeApp({
  credential: getCert(),
});
