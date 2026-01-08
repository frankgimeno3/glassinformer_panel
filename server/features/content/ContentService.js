import * as fs from "node:fs";
import * as path from "node:path";

const CONTENTS_FILE_PATH = path.resolve(process.cwd(), 'app', 'contents', 'contentsContents.json');

function readContentsFile() {
    try {
        const fileContent = fs.readFileSync(CONTENTS_FILE_PATH, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading contents file:', error);
        return [];
    }
}

function writeContentsFile(contents) {
    try {
        fs.writeFileSync(CONTENTS_FILE_PATH, JSON.stringify(contents, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing contents file:', error);
        throw error;
    }
}

export async function getAllContents() {
    return readContentsFile();
}

export async function getContentById(contentId) {
    const contents = readContentsFile();
    const content = contents.find(c => c.content_id === contentId);
    if (!content) {
        throw new Error(`Content with id ${contentId} not found`);
    }
    return content;
}

export async function createContent(contentData) {
    const contents = readContentsFile();
    contents.push(contentData);
    writeContentsFile(contents);
    return contentData;
}

export async function updateContent(contentId, contentData) {
    const contents = readContentsFile();
    const index = contents.findIndex(c => c.content_id === contentId);
    if (index === -1) {
        throw new Error(`Content with id ${contentId} not found`);
    }
    contents[index] = { ...contents[index], ...contentData };
    writeContentsFile(contents);
    return contents[index];
}

export async function deleteContent(contentId) {
    const contents = readContentsFile();
    const index = contents.findIndex(c => c.content_id === contentId);
    if (index === -1) {
        throw new Error(`Content with id ${contentId} not found`);
    }
    const deletedContent = contents.splice(index, 1)[0];
    writeContentsFile(contents);
    return deletedContent;
}



