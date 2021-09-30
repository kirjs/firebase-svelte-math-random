import {getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from "firebase/auth";
import {v4 as uuidv4} from 'uuid';


// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";

import {interval, Observable} from "rxjs";
import {
    addDoc,
    collection, collectionGroup,
    deleteDoc,
    doc,
    getFirestore,
    onSnapshot, orderBy, query,
    serverTimestamp, setDoc,
    updateDoc, where
} from "@firebase/firestore";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
import {readable} from "svelte/store";

import { getMessaging, getToken } from "firebase/messaging";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBzdQueGKwUQfohNa5GZPw6M53mJnGS2LM",
    authDomain: "flowers-bc146.firebaseapp.com",
    projectId: "flowers-bc146",
    storageBucket: "flowers-bc146.appspot.com",
    messagingSenderId: "413767045068",
    appId: "1:413767045068:web:ba094f631621b16f131769",
    measurementId: "G-138N04P4SN"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const messaging = getMessaging();

export function login() {
    signInWithPopup(auth, new GoogleAuthProvider());
}

export function logout() {
    signOut(auth);
}

export const user = new Observable((subscriber) => {
    onAuthStateChanged(auth, subscriber);
});


const storage = getStorage();
const firestore = getFirestore();

export async function createFlower(name, image, interval) {
    const id = uuidv4();
    let storageReference = ref(storage, `images/${id}/${image.name}`);

    await uploadBytes(storageReference, image);
    const url = await getDownloadURL(storageReference);

    const c = collection(firestore, `users/${auth.currentUser.uid}/flowers`);
    await addDoc(c, {
        name,
        url,
        lastWatered: Date.now(),
        nextWatering: Date.now() + interval * 1000,
        interval
    });
}

export const myFlowers = readable([], set => {
    let sub;

    let onAuthStateChanged1 = onAuthStateChanged(auth, (user) => {
        if (sub) {
            sub();
            sub = null;
        }

        if (user) {

            const c = collection(firestore, `users/${user.uid}/flowers`);
            const q = query(c, orderBy('lastWatered', 'desc'))
            sub = onSnapshot(q, (s) => {
                set(s.docs.map(d => {
                    return {
                        id: d.id,
                        ...d.data()
                    };
                }));
            });
        }

    });
    return () => {
        onAuthStateChanged1()
        sub();
    }
});



export const allFlowers = readable([], set => {
    let sub;

    let onAuthStateChanged1 = onAuthStateChanged(auth, (user) => {
        if (sub) {
            sub();
            sub = null;
        }

        if (user) {
            const c = collectionGroup(firestore, `flowers`);
            const q = query(c, orderBy('lastWatered', 'desc'))
            sub = onSnapshot(q, (s) => {
                set(s.docs.map(d => {
                    return {
                        id: d.id,
                        ...d.data()
                    };
                }));
            });
        }

    });
    return () => {
        onAuthStateChanged1()
        sub();
    }
});


export function deleteFlower(id: string){
    deleteDoc(doc(firestore, `users/${auth.currentUser.uid}/flowers/${id}`));
}

export function waterFlower(id, interval){
    updateDoc(doc(firestore, `users/${auth.currentUser.uid}/flowers/${id}`), {
        lastWatered: Date.now(),
        nextWatering: Date.now() + interval * 1000,
    });
}

export function getMessagingToken(){
    getToken(messaging, { vapidKey: 'BII9UnWY6pWOwGtA76ZSTTf5vWSPUGrPLL0TS6BC1h8WoihJfV1ttGDr1-CrmuIUBR8VX8RoumMpNaeAktemKUE' }).then((currentToken) => {
        if (currentToken) {
            setDoc(doc(firestore, `users/${auth.currentUser.uid}`), {currentToken});
            console.log(currentToken);
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
    });

}