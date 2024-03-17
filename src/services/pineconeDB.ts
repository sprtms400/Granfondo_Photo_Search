import { Pinecone } from '@pinecone-database/pinecone'

export const make_connection = function (apiKey: string) {
    const pc = new Pinecone({
        apiKey: apiKey,
    })
    return pc
}