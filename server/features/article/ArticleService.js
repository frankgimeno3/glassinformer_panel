import * as fs from "node:fs";
import * as path from "node:path";

const ARTICLES_FILE_PATH = path.resolve(process.cwd(), 'app', 'contents', 'articlesContents.json');

function readArticlesFile() {
    try {
        const fileContent = fs.readFileSync(ARTICLES_FILE_PATH, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading articles file:', error);
        return [];
    }
}

function writeArticlesFile(articles) {
    try {
        fs.writeFileSync(ARTICLES_FILE_PATH, JSON.stringify(articles, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing articles file:', error);
        throw error;
    }
}

export async function getAllArticles() {
    return readArticlesFile();
}

export async function getArticleById(idArticle) {
    const articles = readArticlesFile();
    const article = articles.find(a => a.id_article === idArticle);
    if (!article) {
        throw new Error(`Article with id ${idArticle} not found`);
    }
    return article;
}

export async function createArticle(articleData) {
    const articles = readArticlesFile();
    articles.push(articleData);
    writeArticlesFile(articles);
    return articleData;
}

export async function updateArticle(idArticle, articleData) {
    const articles = readArticlesFile();
    const index = articles.findIndex(a => a.id_article === idArticle);
    if (index === -1) {
        throw new Error(`Article with id ${idArticle} not found`);
    }
    articles[index] = { ...articles[index], ...articleData };
    writeArticlesFile(articles);
    return articles[index];
}

export async function deleteArticle(idArticle) {
    const articles = readArticlesFile();
    const index = articles.findIndex(a => a.id_article === idArticle);
    if (index === -1) {
        throw new Error(`Article with id ${idArticle} not found`);
    }
    const deletedArticle = articles.splice(index, 1)[0];
    writeArticlesFile(articles);
    return deletedArticle;
}

