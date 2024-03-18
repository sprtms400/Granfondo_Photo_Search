import { Index } from '@pinecone-database/pinecone/dist/index'
import { Pinecone, RecordMetadata } from '@pinecone-database/pinecone'

let pc: Pinecone;
let index: Index<RecordMetadata>

export const init_pinecone = function (key: string) {
    pc = new Pinecone({
        apiKey: key,
    })
    index = pc.index("photosearch")
}

/**
 * namespace list
 * 
 * vector_value == 'Vectorized description of image'
 * 인물은 
 * helmet_desc = helmet.color ? f'{helmet.color}색의 헬멧을 쓰고 있고' : ''.
 * eyewear_desc = eyewear.color ? f{eyewear.color}색의 고글을 쓰고 있고 ' : ''.
 * ...
 * ...
 *
 */

export const upsert_by_photoId = async function (photo_id: string, vector_value: number[], target_appear: string, meta_data: any) {
    const namespace_name = target_appear + "_namespace";
    const ns1 = index.namespace(namespace_name);
    const response = await ns1.upsert([
        {
            id: photo_id,
            values: vector_value, // [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
            // metadata: {
            //     helmet_color: 'color',
            //     dimension: 1536
            // }
            metadata: meta_data
        }
    ]);
    return response
}

export const upsert_bulk = async function (bulks: any, target_appear: string) {
    const namespace_name = target_appear + "_namespace";
    const ns1 = index.namespace(namespace_name);
    const response = await ns1.upsert(bulks);
    return response
}

export const query_single_namespace = async function (vector_value: number[], target_appear: string, top_k: number = 10) {
    const namespace_name = target_appear + "_namespace";
    const ns1 = index.namespace(namespace_name);
    const response = await ns1.query({
        topK: top_k,
        vector: vector_value,
    });
    console.log(response)
    return response
}