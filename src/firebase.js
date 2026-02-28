// Firebase SDK の初期化
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";

// Firebase の設定（環境変数から読み込み）
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase アプリ初期化
const app = initializeApp(firebaseConfig);

// Firestore インスタンス
export const db = getFirestore(app);

// ========================================
// Firestore ユーティリティ関数
// ========================================

/**
 * スライドセットを Firestore に保存する
 * @param {string} projectId - 保存するプロジェクトID（任意の文字列）
 * @param {Array} slides - スライドデータの配列
 * @param {string} theme - テーマカラー ('navy' or 'light')
 */
export const saveProject = async (projectId, slides, theme = 'navy') => {
    const projectRef = doc(db, "projects", projectId);
    // undefinedを除去してFirestoreに安全に保存
    const cleanSlides = JSON.parse(JSON.stringify(slides));
    console.log('[SAVE] 保存するデータ:', { projectId, slideCount: cleanSlides.length, theme });
    await setDoc(projectRef, {
        slides: cleanSlides,
        theme,
        updatedAt: serverTimestamp(),
    });
};

/**
 * Firestore からスライドセットを読み込む
 * @param {string} projectId - 読み込むプロジェクトID
 * @returns {Object|null} - プロジェクトデータ、存在しない場合は null
 */
export const loadProject = async (projectId) => {
    const projectRef = doc(db, "projects", projectId);
    const snap = await getDoc(projectRef);
    if (snap.exists()) {
        const data = snap.data();
        console.log('[LOAD] Firestoreから取得したデータ:', { projectId, slideCount: data.slides?.length, firstSlideTitle: data.slides?.[0]?.title, firstSlideCatchphrase: data.slides?.[0]?.catchphrase });
        return data;
    }
    return null;
};

/**
 * 保存済みプロジェクト一覧を取得する
 * @returns {Array} - プロジェクト一覧（id + データ）
 */
export const listProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

/**
 * プロジェクトを削除する
 * @param {string} projectId - 削除するプロジェクトID
 */
export const deleteProject = async (projectId) => {
    await deleteDoc(doc(db, "projects", projectId));
};
