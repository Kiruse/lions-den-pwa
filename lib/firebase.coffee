import { initializeApp } from 'firebase/app'
import * as auth from 'firebase/auth'
import * as db from 'firebase/firestore'
import { ref } from 'vue'
import request from './requests'

app = initializeApp
  apiKey: 'AIzaSyD8vwZtid5eeIHDkd0dFXxZ6WTP4DRDv1E'
  authDomain: 'lions-den-50d46.firebaseapp.com'
  databaseURL: 'https://lions-den-50d46-default-rtdb.europe-west1.firebasedatabase.app'
  projectId: 'lions-den-50d46'
  storageBucket: 'lions-den-50d46.appspot.com'
  messagingSenderId: '941371144230'
  appId: '1:941371144230:web:8719150fd90545e1ec8ee7'

export idToken = ref localStorage.token
export firebaseUser = ref null

auth.getAuth(app).onAuthStateChanged (user) ->
  firebaseUser.value = user

(->
  result =
    if idToken.value
      await request.post '/login',
        api: 'home'
        headers:
          Authorization: "Bearer #{idToken.value}"
    else
      await request.get '/login?type=anonymous', api: 'home'
  if result.err
    console.error "Failed to login to firebase:", result.err, result.response
    return
  global.token = idToken.value = localStorage.token = result.ok.idToken
  { firebaseToken } = result.ok
  auth.signInWithCustomToken auth.getAuth(app), firebaseToken
)()

export getNews = ->
  inst = db.getFirestore(app)
  coll = db.collection inst, 'news'
  { docs } = await db.getDocs(db.query(
    coll,
    db.orderBy('date', 'desc'),
    db.limit(5),
  ))
  docs.map (doc) -> doc.data()
