import 'dotenv/config'; // Load environment variables from .env file
import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import * as path from 'path';
import * as vm from 'vm';

const prisma = new PrismaClient();

// Define the Word type locally for the seed script, avoiding the import issue
interface Word {
    id: string;
    term: string;
    phonetic: string;
    definition: string;
    translation: string;
    difficulty: string;
    tags: string[];
    etymology?: string;
    example?: string;
    exampleTranslation?: string;
}

async function main() {
    console.log(`Start seeding ...`);

    // Path to the frontend vocabulary file. We need to go up two directories from /backend/prisma.
    const vocabFilePath = path.join(__dirname, '../../../data/vocabulary.ts');
    
    // Read the file content
    const fileContent = await readFile(vocabFilePath, 'utf-8');

    // Isolate the array part of the file. This is a bit brittle but works for this specific file structure.
    const startIndex = fileContent.indexOf('[');
    const endIndex = fileContent.lastIndexOf(']');
    const arrayContent = fileContent.substring(startIndex, endIndex + 1);

    // Use the vm module to safely execute the array string in a sandbox
    const sandbox = { VOCABULARY_DB: [] };
    // The script will assign the array to the sandbox object
    vm.runInNewContext(`VOCABULARY_DB = ${arrayContent}`, sandbox);

    const vocabularyDb: Word[] = sandbox.VOCABULARY_DB;

    if (!vocabularyDb || vocabularyDb.length === 0) {
        throw new Error('Could not parse vocabulary data from file.');
    }

    console.log(`Found ${vocabularyDb.length} words to seed.`);
    
    // Clear the table first
    await prisma.word.deleteMany();
    console.log('Deleted all existing words.');

    for (const word of vocabularyDb) {
        const createdWord = await prisma.word.create({
            data: {
                term: word.term,
                phonetic: word.phonetic,
                definition: word.definition,
                translation: word.translation,
                difficulty: word.difficulty,
                tags: JSON.stringify(word.tags),
                etymology: word.etymology,
                example: word.example,
                exampleTranslation: word.exampleTranslation,
            },
        });
        console.log(`Created word with term: ${createdWord.term}`);
    }

    console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });