import { google } from 'googleapis';
import fetch from 'node-fetch';
/* 数据库自动填充 多次错误未解决放弃这个脚本 */

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

const customsearch = google.customsearch('v1');

async function searchGoogle(query: string): Promise<string> {
    console.log(`Searching Google for: ${query}`);
    return `Placeholder for: ${query}`;
}


async function getWordData(term: string, difficulty: 'Basic' | 'CET-4' | 'CET-6', id: string): Promise<Word | null> {
    try {
        console.log(`Processing word: ${term}`);
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
        if (!response.ok) {
            console.error(`Could not fetch data for ${term}`);
            return null;
        }
        const data = await response.json();
        
        const phonetic = data[0]?.phonetic || data[0]?.phonetics.find(p => p.text)?.text || '';
        const definition = data[0]?.meanings[0]?.definitions[0]?.definition || '';
        const example = data[0]?.meanings[0]?.definitions[0]?.example || '';


        const translation = await searchGoogle(`${term} Chinese translation`);
        const etymologyResult = await searchGoogle(`etymology of the word "${term}"`);
        const exampleTranslation = example ? await searchGoogle(`translate "${example}" to Chinese`) : '';

        const etymology = `Etymology based on: ${etymologyResult}`;

    
        const tags: string[] = [];
        if (definition.includes('science') || definition.includes('academic')) tags.push('Academic');
        if (definition.includes('life') || definition.includes('person')) tags.push('Life');
        if (definition.includes('action') || definition.includes('move')) tags.push('Action');
        if (definition.includes('game') || definition.includes('play')) tags.push('Game');
        if (tags.length === 0) tags.push('General');


        const wordData: Word = {
            id,
            term,
            phonetic,
            definition,
            translation,
            difficulty,
            tags,
            etymology,
            example,
            exampleTranslation
        };

        return wordData;

    } catch (error) {
        console.error(`Error processing ${term}:`, error);
        return null;
    }
}

async function main() {
    const basicWords = ["come", "get", "give", "go", "keep"]; 
    const allWords: Word[] = [];

    for (let i = 0; i < basicWords.length; i++) {
        const word = basicWords[i];
        const wordData = await getWordData(word, 'Basic', `b_${String(i + 1).padStart(3, '0')}`);
        if (wordData) {
            allWords.push(wordData);
        }
    }

    const fileContent = `import { Word } from "../types";\n\nexport const VOCABULARY_DB: Word[] = ${JSON.stringify(allWords, null, 2)};`;

    console.log("\n--- Generated File Content ---");
    console.log(fileContent);
    console.log("--------------------------\n");
    console.log("In a real run, this content would be written to 'new_vocabulary.ts'");
}

main();
