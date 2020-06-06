import firebase from 'firebase/app'
import 'firebase/firestore'
import { firebaseConfig } from './config'

!firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app()

const db = firebase.firestore()

export default db