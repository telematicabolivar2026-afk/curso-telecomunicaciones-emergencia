// Configuración de Firebase para el Curso de Telecomunicaciones de Emergencia
const firebaseConfig = {
  apiKey: "AIzaSyAkXBnK0yPja5gBlLdORhhteX2GdUhl4Qo",
  authDomain: "cruzroja-telecom.firebaseapp.com",
  projectId: "cruzroja-telecom",
  storageBucket: "cruzroja-telecom.firebasestorage.app",
  messagingSenderId: "945652084154",
  appId: "1:945652084154:web:b8ace20d2c9df505bd0183"
};

// Importaciones modulares de Firebase (v13.4.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variable global para identificar al estudiante
let cedulaActual = localStorage.getItem('carnetEstudiante'); // Mantenemos el nombre de la variable interna para no romper el HTML

// Funciones que usa el HTML
function obtenerCarnet() {
    return localStorage.getItem('carnetEstudiante');
}

function guardarCarnet(cedula) {
    localStorage.setItem('carnetEstudiante', cedula);
    cedulaActual = cedula;
}

// Función para guardar/actualizar el progreso en la nube
async function guardarModuloCompletado(numeroModulo) {
    if (!cedulaActual) return;
    
    try {
        const docRef = doc(db, "progresos", cedulaActual);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Si el documento existe, actualizamos solo el módulo que se completó
            await updateDoc(docRef, {
                [`modulo${numeroModulo}`]: true,
                ultimaActualizacion: new Date()
            });
        } else {
            // Si es nuevo, lo creamos
            await setDoc(docRef, {
                cedula: cedulaActual,
                [`modulo${numeroModulo}`]: true,
                ultimaActualizacion: new Date()
            });
        }
        console.log("Progreso guardado para el módulo:", numeroModulo);
    } catch (error) {
        console.error("Error guardando el progreso:", error);
    }
}

// Función para leer el progreso del estudiante
async function leerProgreso() {
    if (!cedulaActual) return null;
    
    try {
        const docRef = doc(db, "progresos", cedulaActual);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error leyendo el progreso:", error);
        return null;
    }
}

// Función para contar cuántos módulos van completados
function contarModulosCompletados(datos) {
    if (!datos) return 0;
    let contador = 0;
    // Asumimos que el curso tiene hasta 12 módulos
    for (let i = 1; i <= 12; i++) {
        if (datos[`modulo${i}`] === true) {
            contador++;
        }
    }
    return contador;
}
