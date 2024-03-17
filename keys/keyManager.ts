import fs from 'fs/promises';

export const readKeys = async function () {
    try {
        const openaiData = await fs.readFile('./keys/openai.json', 'utf8');
        const pineconeData = await fs.readFile('./keys/pinecone.json', 'utf8');

        const openai_key: string = JSON.parse(openaiData)['key'];
        const pinecone_key: string = JSON.parse(pineconeData)['key'];

        if (openai_key === '' || pinecone_key === '') {
            console.log('readKeys is empty');
            throw new Error('readKeys is empty');
        }
        // 데이터를 처리하거나 결과를 반환합니다.
    } catch (error) {
        console.error('error:', error);
        return false; // 에러 발생 시 false 반환
    }
};

export const readKey = async function (json_path: string) {
    try {
        const keyData = await fs.readFile(json_path, 'utf8');
        const key_value: string = JSON.parse(keyData)['key'];
        return key_value;
    } catch (error) {
        console.error('error:', error);
        return ''; // 에러 발생 시 false 반환
    }
}

export const readKey_openai = async function () {
    try {
        const openaiData = await fs.readFile('./keys/openai.json', 'utf8');
        const key_value: string = await JSON.parse(openaiData)['key'];
        return key_value;
    } catch (error) {
        console.error('error:', error);
        return ''; // 에러 발생 시 false 반환
    }
}

export const readKey_pinecone = async function () {
    try {
        const pineconeData = await fs.readFile('./keys/pinecone.json', 'utf8');
        const key_value: string = JSON.parse(pineconeData)['key'];
        return key_value;
    } catch (error) {
        console.error('error:', error);
        return ''; // 에러 발생 시 false 반환
    }
}