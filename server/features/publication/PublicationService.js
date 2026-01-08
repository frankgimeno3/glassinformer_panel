import * as fs from "node:fs";
import * as path from "node:path";

const PUBLICATIONS_FILE_PATH = path.resolve(process.cwd(), 'app', 'contents', 'publicationsContents.json');

function readPublicationsFile() {
    try {
        const fileContent = fs.readFileSync(PUBLICATIONS_FILE_PATH, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading publications file:', error);
        return [];
    }
}

function writePublicationsFile(publications) {
    try {
        fs.writeFileSync(PUBLICATIONS_FILE_PATH, JSON.stringify(publications, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing publications file:', error);
        throw error;
    }
}

export async function getAllPublications() {
    return readPublicationsFile();
}

export async function getPublicationById(idPublication) {
    const publications = readPublicationsFile();
    const publication = publications.find(p => p.id_publication === idPublication);
    if (!publication) {
        throw new Error(`Publication with id ${idPublication} not found`);
    }
    return publication;
}

export async function createPublication(publicationData) {
    const publications = readPublicationsFile();
    publications.push(publicationData);
    writePublicationsFile(publications);
    return publicationData;
}

export async function updatePublication(idPublication, publicationData) {
    const publications = readPublicationsFile();
    const index = publications.findIndex(p => p.id_publication === idPublication);
    if (index === -1) {
        throw new Error(`Publication with id ${idPublication} not found`);
    }
    publications[index] = { ...publications[index], ...publicationData };
    writePublicationsFile(publications);
    return publications[index];
}

export async function deletePublication(idPublication) {
    const publications = readPublicationsFile();
    const index = publications.findIndex(p => p.id_publication === idPublication);
    if (index === -1) {
        throw new Error(`Publication with id ${idPublication} not found`);
    }
    const deletedPublication = publications.splice(index, 1)[0];
    writePublicationsFile(publications);
    return deletedPublication;
}




