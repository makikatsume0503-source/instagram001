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

// Firebase の設定
const firebaseConfig = {
    apiKey: "AIzaSyBS257-jG1cnNt2m9PJZCf3Qh1P0ru4NPA",
    authDomain: "instagram001-2ee7b.firebaseapp.com",
    projectId: "instagram001-2ee7b",
    storageBucket: "instagram001-2ee7b.firebasestorage.app",
    messagingSenderId: "186602355939",
    appId: "1:186602355939:web:43dc1577b17e53501919d6"
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
    await setDoc(projectRef, {
        slides,
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
        return snap.data();
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
