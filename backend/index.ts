import express from 'express';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client';
import 'dotenv/config';

// Correctly initialize Prisma Client. In a server context, it's more reliable.
const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files from a 'public' directory

// --- API for the Game ---

// GET /api/vocabulary?difficulty=CET-4
app.get('/api/vocabulary', async (req, res) => {
    const { difficulty } = req.query;

    if (!difficulty || typeof difficulty !== 'string') {
        return res.status(400).json({ error: 'Difficulty query parameter is required.' });
    }

    try {
        const words = await prisma.word.findMany({
            where: {
                difficulty: {
                    equals: difficulty,
                },
            },
        });
        // Since tags are stored as a JSON string, parse them before sending.
        const wordsWithParsedTags = words.map(word => ({
            ...word,
            tags: JSON.parse(word.tags || '[]')
        }));
        res.json(wordsWithParsedTags);
    } catch (error) {
        console.error('Failed to fetch vocabulary:', error);
        res.status(500).json({ error: 'Failed to fetch vocabulary' });
    }
});


// --- CRUD API for Admin ---

// GET /api/words - Get all words
app.get('/api/words', async (req, res) => {
    try {
        const words = await prisma.word.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const wordsWithParsedTags = words.map(word => ({
            ...word,
            tags: JSON.parse(word.tags || '[]')
        }));
        res.json(wordsWithParsedTags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch words' });
    }
});

// POST /api/words - Create a new word
app.post('/api/words', async (req, res) => {
    try {
        const { term, phonetic, definition, translation, difficulty, tags, etymology, example, exampleTranslation } = req.body;
        if (!term || !translation || !difficulty) {
            return res.status(400).json({ error: 'Term, Translation, and Difficulty are required.' });
        }
        const newWord = await prisma.word.create({
            data: {
                term,
                phonetic,
                definition,
                translation,
                difficulty,
                tags: JSON.stringify(tags || []),
                etymology,
                example,
                exampleTranslation
            },
        });
        res.status(201).json(newWord);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ error: `单词 "${req.body.term}" 已存在。` });
        }
        console.error('Failed to create word:', error);
        res.status(500).json({ error: '创建单词失败，请检查服务器日志。' });
    }
});

// PUT /api/words/:id - Update a word
app.put('/api/words/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { term, phonetic, definition, translation, difficulty, tags, etymology, example, exampleTranslation } = req.body;
        const updatedWord = await prisma.word.update({
            where: { id },
            data: {
                term,
                phonetic,
                definition,
                translation,
                difficulty,
                tags: JSON.stringify(tags || []),
                etymology,
                example,
                exampleTranslation
            },
        });
        res.json(updatedWord);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ error: `单词 "${req.body.term}" 已存在。` });
        }
        console.error(`Failed to update word with id: ${id}:`, error);
        res.status(500).json({ error: `更新单词失败，请检查服务器日志。` });
    }
});

// DELETE /api/words/:id - Delete a word
app.delete('/api/words/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.word.delete({
            where: { id },
        });
        res.status(204).send(); // No content
    } catch (error) {
        console.error(`Failed to delete word with id: ${id}:`, error);
        res.status(500).json({ error: `Failed to delete word with id: ${id}` });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
