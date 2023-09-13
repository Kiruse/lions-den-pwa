#!/usr/bin/env node
import * as firebase from 'firebase-admin/app';
import * as firestore from 'firebase-admin/firestore';
import * as fs from 'fs/promises';

const cert = firebase.cert(JSON.parse(await fs.readFile('./service-account.json', 'utf8')));

const app = firebase.initializeApp({ credential: cert });
const db = firestore.getFirestore(app);

const [filepath, ...args] = process.argv.slice(2);

const idxAuthor = args.indexOf('--author') ?? args.indexOf('-a');
const idxTitle  = args.indexOf('--title')  ?? args.indexOf('-t');

const author = args[idxAuthor + 1];
const title  = args[idxTitle  + 1];

if (!author || !title) {
  console.error('Missing required arguments: --author, --title');
  process.exit(1);
}

await db.collection('news').add({
  author,
  title,
  content: await fs.readFile(filepath, 'utf8'),
  date: new Date(),
});
process.exit(0);
