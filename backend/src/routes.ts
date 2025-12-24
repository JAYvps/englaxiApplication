import { Router, Request, Response } from 'express';
import db from './database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const router = Router();

// --- Auth Endpoints ---

router.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    db.get(query, [email], (err, user: any) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error comparing passwords." });
            }
            if (result) {
                // Passwords match
                const { password, ...userData } = user; // Exclude password from response
                res.json({
                    ...userData,
                    completedNodes: JSON.parse(userData.completedNodes || '[]'),
                    ownedSkins: JSON.parse(userData.ownedSkins || '[]'),
                });
            } else {
                // Passwords don't match
                res.status(401).json({ message: "Invalid credentials." });
            }
        });
    });
});


// --- Word CRUD Endpoints ---

// GET words, with optional difficulty and limit filters
router.get('/words', (req: Request, res: Response) => {
    const { difficulty, limit = 10 } = req.query;

    let query = "SELECT * FROM words";
    const params: any[] = [];

    if (difficulty && difficulty !== 'All') {
        query += " WHERE difficulty = ?";
        params.push(difficulty as string);
    }
    
    query += " ORDER BY RANDOM() LIMIT ?";
    params.push(Number(limit));

    db.all(query, params, (err, rows: any[]) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const words = rows.map((word: any) => ({
            ...word,
            tags: JSON.parse(word.tags || '[]')
        }));
        res.json(words);
    });
});

// POST a new word
router.post('/words', (req: Request, res: Response) => {
// ... (rest of the file is the same, only the GET /words was affected by the bug)
    const { id, term, phonetic, definition, example, exampleTranslation, translation, difficulty, tags, etymology } = req.body;
    const newId = id || `w_${uuidv4()}`;
    
    const query = `INSERT INTO words (id, term, phonetic, definition, example, exampleTranslation, translation, difficulty, tags, etymology) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [newId, term, phonetic, definition, example, exampleTranslation, translation, difficulty, JSON.stringify(tags || []), etymology], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: newId });
    });
});

// PUT (update) a word
router.put('/words/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { term, phonetic, definition, example, exampleTranslation, translation, difficulty, tags, etymology } = req.body;

    const query = `UPDATE words SET term = ?, phonetic = ?, definition = ?, example = ?, exampleTranslation = ?, translation = ?, difficulty = ?, tags = ?, etymology = ? 
                   WHERE id = ?`;

    db.run(query, [term, phonetic, definition, example, exampleTranslation, translation, difficulty, JSON.stringify(tags || []), etymology, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: "Word not found" });
        } else {
            res.status(200).json({ message: "Word updated successfully" });
        }
    });
});

// DELETE a word
router.delete('/words/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const query = "DELETE FROM words WHERE id = ?";

    db.run(query, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: "Word not found" });
        } else {
            res.status(200).json({ message: "Word deleted successfully" });
        }
    });
});


// --- User Data Endpoints (previously Player) ---

// GET user data by ID
router.get('/users/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const query = "SELECT * FROM users WHERE id = ?";

    db.get(query, [id], (err, user: any) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!user) {
            res.status(404).json({ message: "User not found" });
        } else {
            const { password, ...userData } = user;
            res.json({
                ...userData,
                completedNodes: JSON.parse(userData.completedNodes || '[]'),
                ownedSkins: JSON.parse(userData.ownedSkins || '[]'),
            });
        }
    });
});

// PUT (update) user data
router.put('/users/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { level, exp, gems, potions, medals, completedNodes, ownedSkins, equippedSkin } = req.body;

    const query = `UPDATE users SET 
                        level = ?, 
                        exp = ?,
                        gems = ?, 
                        potions = ?, 
                        medals = ?, 
                        completedNodes = ?, 
                        ownedSkins = ?, 
                        equippedSkin = ?
                   WHERE id = ?`;
    
    db.run(query, [
        level,
        exp,
        gems,
        potions,
        medals,
        JSON.stringify(completedNodes || []),
        JSON.stringify(ownedSkins || []),
        equippedSkin,
        id
    ], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(200).json({ message: "User data updated successfully." });
        }
    });
});


export default router;
