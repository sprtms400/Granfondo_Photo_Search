import { ChatOpenAI, ChatOpenAICallOptions, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

let chatModel: ChatOpenAI<ChatOpenAICallOptions>;
let embeddings1536: OpenAIEmbeddings;
export const init_langchain = function (key: string | undefined) {
    console.log('init_langchain: ', key)

    if (typeof key == 'undefined') {
        throw new Error("OpenAI API Key is undefined") 
    } else if (typeof key == 'string') {
        chatModel = new ChatOpenAI({
            openAIApiKey: key,
            modelName: "gpt-3.5-turbo",
        })
        /**
         * Langchain Textembedding guidance
         * Follow link : https://js.langchain.com/docs/integrations/text_embedding/openai
         */
        embeddings1536 = new OpenAIEmbeddings({
            openAIApiKey: key,
            batchSize: 512,
            modelName: "text-embedding-ada-002",
            // dimensions: 1024
            /**
             * << pricing policy >>
             * Follow link : https://openai.com/pricing
             * text-embedding-3-small	$0.02 / 1M tokens
             * text-embedding-3-large	$0.13 / 1M tokens
             * ada v2	                $0.10 / 1M tokens
             */
        })
    }
}

const outputParser = new StringOutputParser();

export const vecterize_words = async function (words: string) {
    try {
        const vectors = await embeddings1536.embedQuery(words);
        const vectorized_words = vectors;
        console.log('vectorized_words : ', vectorized_words);
        return vectorized_words;
    } catch (error) {
        console.log('error: ', error)
        return []
    }
}

export const llm_route_searchtype = async function (query: string) {
    try {
        const assistant_requirment: string = "너는 검색타입을 분류하는 에이전트이다. 번호판에 대한 번호를 이용한 검색인지, 이미지 내의 인물의 인상착의에 대한 검색인지를 분류하여라. 전달받은 검색어를 분석하여 번호판에 대한 검색인지, 인물의 인상착의에 대한 검색인지를 판단하여라. 번호판에 대한 검색이라면 'number_plate', 인물의 인상착의에 대한 검색이라면 'appearance'를 반환하라. 만약 분류에 실패하면 사과하지 말고 빈 문자열을 반환하라." 
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", assistant_requirment],
            ["user", "검색어 : {input}"],
        ]);
        const chain = prompt.pipe(chatModel).pipe(outputParser);
        const response = await chain.invoke({
            input: query,
        });
        const parsed_response = JSON.parse(JSON.stringify(response));
        return JSON.parse(parsed_response);
    } catch (error) {
        console.log('error: ', error)
        return {}
    }
}
/**
 * 
 * @param query 
 * @returns JSON.parse ed query
 * {
 *   sex: 'male',
 *   helmet: 'black',
 *   eyewear: null,
 *   upper: null,
 *   lower: null,
 *   socks: null,
 *   shoes: null,
 *   bicycle: null
 *  }
 */
export const llm_parse_query = async function (query: string) {
    try {
        const parsing_assistant_requirment: string = "너는 검색어를 전처리하는 에이전트이다. 검색어는 이미지내의 인물의 인상착의에 대해 서술한 것이다. 전달받은 검색어에서 다음 항목에 해당하는 것을 추출하여라. 인물의 성별, 헬멧의 색상, 고글의 색상, 상의의 색상, 상의의 소매의 길이, 하의의 색상, 하의의 기장 길이, 양말의 색상, 신발의 색상, 자전거의 색상. 추출된 항목을 영어로 번역하여 json 형태로 반환해야 한다. 찾지 못한 항목에 대해서 사과하지 말고 결과만 json형태로 반환하라. json의 키값은 다음으로 고정하여라" 
            +"sex, helmet, eyewear, upper, upper_sleeve, lower, lower_sleeve, socks, shoes, gloves, bicycle, 전달받지 않은 검색어는 null 로 통일하라.";

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", parsing_assistant_requirment],
            ["user", "검색어 : {input}"],
        ]);
        const chain = prompt.pipe(chatModel).pipe(outputParser);
        const response = await chain.invoke({
            input: query,
        });
        const parsed_response = JSON.parse(JSON.stringify(response));
        return JSON.parse(parsed_response);
    } catch (error) {
        console.log('error: ', error)
        return {}
    }
}

/**
 * 
 * @param color Natural text of color likes... 'black', 'white', 'red'
 * @returns 
 */
export const llm_colorText_to_RGBcode = async function (color: string) {
    try {
        const color_assistant_requirment: string = "너는 색상을 의미하는 단어를 RGB 코드로 변환하는 에이전트이다. 전달받은 색상단어를 RGB 코드로 변환하여라. 변환된 RGB 코드를 반환하라. 만약 변환에 실패하면 빈 문자열을 반환하라."
            + "반환은 JSON 형태로 강제한다 내용은 다음을 포함해야 한다. R: 0-255, G: 0-255, B: 0-255"
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", color_assistant_requirment],
            ["user", "검색어 : {input}"],
        ]);
        const chain = prompt.pipe(chatModel).pipe(outputParser);
        const response = await chain.invoke({
            input: color,
        });
        const parsed_response = JSON.parse(JSON.stringify(response));
        console.log('RGB_response: ', parsed_response)
        return JSON.parse(parsed_response);
    } catch (error) {
        console.log('error: ', error)
        return ''
    }
}

/**
 * 
 * @param color Natural text of color likes... 'black', 'white', 'red'
 * @returns CIELAB code
 */
export const llm_colorText_to_CIELAB = async function (color: string, D: string = 'D65') {
    try {
        const color_assistant_requirment: string = "너는 색상을 의미하는 단어를 CIELAB 코드로 변환하는 에이전트이다. 전달받은 색상단어를 CIELAB 코드로 변환하여라. 백색점의 기준은 "+ D +"를 기준으로 한다. 변환된 CIELAB 코드를 반환하라. 만약 변환에 실패하면 빈 문자열을 반환하라."
        + '반환은 JSON 형태로 강제한다 내용은 다음을 포함해야 한다. L: 0-100, a: -128-127, b: -128-127'
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", color_assistant_requirment],
            ["user", "검색어 : {input}"],
        ]);
        const chain = prompt.pipe(chatModel).pipe(outputParser);
        const response = await chain.invoke({
            input: color,
        });
        const parsed_response = JSON.parse(JSON.stringify(response));
        console.log('CIELAB_response: ', parsed_response)
        return JSON.parse(parsed_response);
    } catch (error) {
        console.log('error: ', error)
        return ''
    }
}

// parsed_query {
//   sex: null,
//   helmet: 'white',
//   eyewear: 'black',
//   upper: 'red',
//   upper_sleeve: 'long',
//   lower: 'black',
//   lower_sleeve: null,
//   socks: 'white',
//   shoes: 'black',
//   gloves: null,
//   bicycle: 'red'
// }
interface ParsedQuery {
    sex: string | null,
    helmet: string | null,
    eyewear: string | null,
    upper: string | null,
    upper_sleeve: string | null,
    lower: string | null,
    lower_sleeve: string | null,
    socks: string | null,
    shoes: string | null,
    gloves: string | null,
    bicycle: string | null
}
export const llm_generatre_query = async function (original_parsed_query: ParsedQuery) {
    try {
        // const parsed_query = JSON.parse(JSON.stringify(original_parsed_query))
        const parsed_query = original_parsed_query;
        console.log('parsed_query: ', parsed_query)
        let sex_description = '';
        let helmet_color_description = '';
        let eyewear_color_description = '';
        let upper_sleeve_description = '';
        let upper_color_description = '';
        let upper_total_description = '';
        let lower_sleeve_description = '';
        let lower_color_description = '';
        let lower_total_description = '';
        // let socks_color_description = '';
        let shoes_color_description = '';
        let gloves_color_description = '';
        let bicycle_color_description = '';

        if (parsed_query.sex) {
            sex_description = 'A '+ parsed_query.sex;
        } else {
            sex_description = 'A person ';
        }
        if (parsed_query.helmet) {
            helmet_color_description = 'is wearing a ' + parsed_query.helmet + ' helmet,';
        }
        if (parsed_query.eyewear) {
            eyewear_color_description = parsed_query.eyewear + ' eyewear,';
        }
        if (parsed_query.upper) {
            upper_sleeve_description = parsed_query.upper_sleeve ? parsed_query.upper_sleeve + ' sleeve,' : '';
            upper_color_description = parsed_query.upper;
            upper_total_description = upper_sleeve_description + ' ' + upper_color_description + ' upper,';
        }
        if (parsed_query.lower) {
            lower_sleeve_description = parsed_query.lower_sleeve ? parsed_query.lower_sleeve + ' sleeve,' : '';
            lower_color_description = parsed_query.lower;
            lower_total_description = lower_sleeve_description + ' ' + lower_color_description + ' lower,';
        }
        // if (parsed_query.socks) {
        //     gloves_color_description = parsed_query.socks + ' socks';
        // }
        if (parsed_query.shoes) {
            shoes_color_description = parsed_query.shoes + ' shoes,';
        }
        if (parsed_query.gloves) {
            gloves_color_description = parsed_query.gloves + ' gloves,';
        }
        if (parsed_query.bicycle) {
            bicycle_color_description = 'and riding a ' + parsed_query.bicycle + ' bicycle,';
        }

        const total_description = sex_description + helmet_color_description + eyewear_color_description + upper_total_description + lower_total_description + shoes_color_description + gloves_color_description + bicycle_color_description + '.'
        return total_description

    } catch (error) {
        console.log('error: ', error)
        return ''
    }
}