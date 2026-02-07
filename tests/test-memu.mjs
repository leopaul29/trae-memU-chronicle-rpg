// test-memu.mjs
// import fetch from 'node-fetch'; // Si tu es sur une version ancienne de Node, sinon fetch est natif

import { log } from "console";

const API_KEY = process.env.MEMU_API_KEY;
const BASE_URL = process.env.MEMU_API_URL;

const USER_ID = "test_user_789";
const AGENT_ID = "test_agent_456";

async function testMemU() {
    console.log("--- Début du test MemU Standalone ---");

    // 1. TEST DE MEMORISATION (Obligatoire avant de retrieve)
    console.log("\n1. Test de /memorize...");
    const memorizePayload = {
        conversation: [
            { role: "user", content: "Bonjour, je m'appelle Arthur et je suis un paladin." },
            { role: "assistant", content: "Bienvenue Arthur. Je me souviendrai de votre titre." },
            { role: "user", content: "Je déteste les gobelins." }
        ],
        user_id: USER_ID,
        agent_id: AGENT_ID
    };

    try {
        const memRes = await fetch(`${BASE_URL}/api/v3/memory/memorize`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(memorizePayload)
        });

        if (!memRes.ok) {
            const errorText = await memRes.text();
            console.error(`Erreur Memorize (${memRes.status}):`, errorText);
            return;
        }

        const memData = await memRes.json();
        console.log("Succès Memorize ! Task ID:", memData.task_id);

        // Attendre 5 secondes que le serveur traite la mémoire
        console.log("Attente de 5s pour le traitement...");
        await new Promise(r => setTimeout(r, 5000));

        // 2. TEST DE RECUPERATION (Retrieve)
        console.log("\n2. Test de /retrieve...");
        const retrievePayload = {
            user_id: USER_ID,
            agent_id: AGENT_ID,
            query: "Comment s'appelle le joueur et qu'est-ce qu'il n'aime pas ?"
        };

        const retRes = await fetch(`${BASE_URL}/api/v3/memory/retrieve`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(retrievePayload)
        });

        if (!retRes.ok) {
            const errorText = await retRes.text();
            console.error(`Erreur Retrieve (${retRes.status}):`, errorText);
        } else {
            const retData = await retRes.json();
            console.log("Succès Retrieve ! Données reçues :");
            console.log(JSON.stringify(retData, null, 2));
        }

    } catch (error) {
        console.error("Erreur réseau ou script :", error);
    }
}

testMemU();