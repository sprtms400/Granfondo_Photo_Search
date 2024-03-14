import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';

export const verterize_word = async function (word: string) {
    try {

    } catch (error) {

    }
}

/**
 * Langchain Textembedding guidance
 * Follow link : https://js.langchain.com/docs/integrations/text_embedding/openai
 */
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: 'API-KEY',        // Environment variable 로 찾을것
    batchSize: 512,
    modelName: "text-embedding-3-large"
    /**
     * << pricing policy >>
     * Follow link : https://openai.com/pricing
     * text-embedding-3-small	$0.02 / 1M tokens
     * text-embedding-3-large	$0.13 / 1M tokens
     * ada v2	                $0.10 / 1M tokens
     */
})