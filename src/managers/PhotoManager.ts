import multer from 'multer';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';
import { IPhoto, INumberPlate, Photo as oPhoto, IAppearance } from '../models/Photo';
import config from '../config';
import { langchain, pineconeDB } from '../utils';
import { gStorage, rabbitmq } from '../services';

const makeMetaData = function (userId: string, photoId: string, srcLink: string, competition: string, author: string, photographedTime: string, width: number|null, height: number|null, fileSize: number|null, fileType: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        const photo = new oPhoto({
            photoId: photoId,
            srcLink: srcLink,
            competition: competition,
            author: author,
            photographedTime: photographedTime,
            width: width,
            height: height,
            fileSize: fileSize,
            fileType: fileType,
            createdDate: new Date(),
            updatedDate: new Date(),
            isPhotoAnalyzedAppearance: false,
            isPhotoAnalyzedNumberPlate: false,
            appearance: {
                sex: 'unknown',
                helemt: {
                    color: 'unknown',
                    description: 'unknown',
                },
                eyewear: {
                    isWearing: false,
                    color: 'unknown',
                    description: 'unknown',
                },
                upper: {
                    sellve: 'unknown',
                    color: 'unknown',
                    description: 'unknown',
                },
                lower: {
                    sleeve: 'unknown',
                    color: 'unknown',
                    description: 'unknown',
                },
                socks: {
                    color: 'unknown',
                    description: 'unknown',
                },
                shoes: {
                    color: 'unknown',
                    description: 'unknown',
                },
                gloves: {
                    color: 'unknown',
                    description: 'unknown',
                },
                bicyle: {
                    color: 'unknown',
                    description: 'unknown',
                }
            },
            numberPlate: {
                isNumberPlateDetected: false,
                numberPlate: 'unknown',
                probability: 0,
            }
            // uploader: userId
        });
        photo.save().then((photo: IPhoto) => {
            return callback(null, null, 200, null, photo);
        })
        .catch((error: Error) => {
            console.log('error', error);
            return callback(24, 'save_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        console.log('error', error);
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

// Code conventioned
export const initUpload = function (userId: string, photoId: string, srcLink: string, competition: string, author: string, photographedTime: string, width: number, height: number, fileSize: number, fileType: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        makeMetaData(userId, photoId, srcLink, competition, author, photographedTime, width, height, fileSize, fileType, function (errorCode, shortMessage, httpCode, description, photo) {
            if(errorCode) {
                return callback(errorCode, shortMessage, httpCode, description, null);
            }
            if(photo) {
                return callback(null, null, 200, null, photo);
            }
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

// This is experimental code for development
export const getPresignedUrl_dev = async function (assetName: string, 
    callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, url: string|null) => void) {
    try {
        console.log('getPresignedUrl_dev')
        const storage = new Storage({keyFilename: config.gcp.storageBucket.keyFilename})
        const bucketName = config.gcp.storageBucket.bucketName;
        const bucket = storage.bucket(bucketName);
        const fileName = assetName;
        const options: {
            version: 'v4' | 'v2' | undefined;
            action: 'write' | 'read' | 'delete' | 'resumable';
            expires: number;
            contentType: string;
        } = {
            version: 'v4',
            action: 'write',
            expires: Date.now() + 15 * 60 * 1000, // url available in 15 minutes
            contentType: 'application/octet-stream',
        };
        console.log('fileName', fileName)
        const [url] = await bucket.file(fileName).getSignedUrl(options);
        return callback(null, null, 200, null, url);
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const getPresignedUrl = async function (photoId: string, 
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, url: string|null) => void) {
    try {
        // 1. find photo meta data in mongodb
        // 2. generate presigned url
        // 업로드 되는 디렉토리 위치 설정을 변경할 필요가 존재함.
        await oPhoto.findOne({'photoId': photoId}).then(async (photo: IPhoto|null) => {
            if(!photo) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            }
            const storage = new Storage({keyFilename: config.gcp.storageBucket.keyFilename})
            const bucketName = config.gcp.storageBucket.bucketName;
            const bucket = storage.bucket(bucketName);
            const fileName = photoId;
            const options: {
                version: 'v4' | 'v2' | undefined;
                action: 'write' | 'read' | 'delete' | 'resumable';
                expires: number;
                contentType: string;
            } = {
                version: 'v4',
                action: 'write',
                expires: Date.now() + 15 * 60 * 1000, // url available in 15 minutes
                contentType: 'application/octet-stream',
            };

            const [url] = await bucket.file(fileName).getSignedUrl(options);
            return callback(null, null, 200, null, url);
            
        })
        .catch((error: Error) => {
            return callback(24, 'find_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const uploadSuccess = function (photoId: string, userId: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        oPhoto.findByIdAndUpdate({_id: photoId, uploader: userId}, {uploadSucess: true}).then((photo: IPhoto|null) => {
            if(!photoId) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            }
            return callback(null, null, 200, null, photo);
        })
        .catch((error: Error) => {
            return callback(24, 'update_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

/**
 * upload photo to google cloud storage
 */

export const upload = async function (accessUserId: string, file: Express.Multer.File, photoId: string, competition: string, author: string, photographedTime: string, srcLink: string, 
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photoUrl: string|null) => void) {
    try {
        /**
         * 1. file에서 메타데이터 추출
         * 2. Meta데이터 추출 및 db에 저장
         * 3. Google Cloud Storage에 업로드
         * 4. Queue 에 분석 요청 메세지 전송
         */
        // 1
        let width: number = 0
        let height: number = 0
        let fileSize: number = 0
        let fileType: string = ''
        await sharp(file.buffer)
        .metadata()
        .then((metadata) => {
            width = metadata.width ? metadata.width : 0;
            height = metadata.height ? metadata.height : 0;
            fileSize = metadata.size ? metadata.size : 0;
            fileType = metadata.format ? metadata.format : '';
        })
        .catch((error: Error) => {
            console.log('error', error);
            return callback(22, 'metadata_extraction_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
        // 2
        await makeMetaData(accessUserId, photoId, srcLink, competition, author, photographedTime, width, height, fileSize, fileType, function (errorCode, shortMessage, httpCode, description, photo) {
            if (errorCode) {
                return callback(errorCode, shortMessage, httpCode, description, null);
            }
            // 3
            if (!photo) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            } else {
                gStorage.uploadImage(file, competition, photoId, async function (errorCode, shortMessage, httpCode, description, photoURL) {
                    if (errorCode) {
                        return callback(errorCode, shortMessage, httpCode, description, null);
                    }
                    // 4
                    const uploadResultAppearnace = await rabbitmq.requestAnalyzeAppearance(photoId);
                    const uploadResultNumberPlate = await rabbitmq.requestAnalyzeNumberPlate(photoId);
                    if (uploadResultAppearnace && uploadResultNumberPlate) {
                        return callback(null, null, 200, null, photoURL);
                    } else {
                        return callback(24, 'upload_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
                    }
                });
            }
        });
    } catch (error) {
        console.log('error', error);
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const getPhoto = function (photoId: string, 
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        oPhoto.findOne({'photoId': photoId}).then((photo: IPhoto|null) => {
            if(!photo) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            }
            return callback(null, null, 200, null, photo);
        })
        .catch((error: Error) => {
            return callback(24, 'find_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const updateAppearance = function (photoId: string, appearance: any,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        const newAppearanceData = {
            "sex": appearance["sex"],
            "helmet": {
                "isWearing": appearance["helmet"]["isWearing"],
                "color": appearance["helmet"]["color"],
                "description": appearance["helmet"]["description"]
            },
            "eyewear": {
                "isWearing": appearance["eyewear"]["isWearing"],
                "color": appearance["eyewear"]["color"],
                "description": appearance["eyewear"]["description"]
            },
            "upper": {
                "sleeve": appearance["upper"]["sleeve"],
                "color": appearance["upper"]["color"],
                "description": appearance["upper"]["description"]
            },
            "lower": {
                "sleeve": appearance["lower"]["sleeve"],
                "color": appearance["lower"]["color"],
                "description": appearance["lower"]["description"]
            },
            "sockes": {
                "isWearing": appearance["socks"]["isWearing"],
                "color": appearance["socks"]["color"],
                "description": appearance["socks"]["description"]
            },
            "shoes": {
                "isWearing": appearance["shoes"]["isWearing"],
                "color": appearance["shoes"]["color"],
                "description": appearance["shoes"]["description"]
            },
            "gloves": {
                "isWearing": appearance["gloves"]["isWearing"],
                "color": appearance["gloves"]["color"],
                "description": appearance["gloves"]["description"]
            },
            "bicycle": {
                "isRiding": appearance["bicycle"]["isRiding"],
                "color": appearance["bicycle"]["color"],
                "description": appearance["bicycle"]["description"]
            }
        }
        oPhoto.findOneAndUpdate({photoId: photoId}, {appearance: newAppearanceData}).then((photo: IPhoto|null) => {
            if(!photo) {
                console.log('photo not found')
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            }
            return callback(null, null, 200, null, photo);
        })
        .catch((error: Error) => {
            console.log('error', error);
            return callback(24, 'update_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const updateNumberPlate = function (photoId: string, newNumberPalte: INumberPlate,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        oPhoto.findOneAndUpdate({photoId: photoId}, {$push: {numberPlate: newNumberPalte}}, {new: true}).then((photo: IPhoto|null) => {
            if(!photo) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            }
            return callback(null, null, 200, null, photo);
        })
        .catch((error: Error) => {
            return callback(24, 'update_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const checkNumberPlateAnalyzed = function (photoId: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        oPhoto.findOneAndUpdate({photoId: photoId}, {isPhotoAnalyzedNumberPlate: true}).then((photo: IPhoto|null) => {
            if(!photo) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            }
            return callback(null, null, 200, null, photo);
        })
        .catch((error: Error) => {
            return callback(24, 'find_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const checkAppearanceAnalyzed = function (photoId: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        oPhoto.findOneAndUpdate({photoId: photoId}, {isPhotoAnalyzedAppearance: true}).then((photo: IPhoto|null) => {
            if(!photo) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            }
            return callback(null, null, 200, null, photo);
        })
        .catch((error: Error) => {
            return callback(24, 'find_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const getPhotos = function (
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photos: IPhoto[]|null) => void) {
    try {
        oPhoto.find({}).then((photos: IPhoto[]|[]) => {
            if(!photos) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', []);
            }
            console.log('photos', photos)
            return callback(null, null, 200, null, photos);
        })
        .catch((error: Error) => {
            return callback(24, 'find_photo_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const updatePhoto = function (photoId: string, photo: IPhoto,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, photo: IPhoto|null) => void) {
    try {
        oPhoto.findOneAndUpdate({photoId: photoId}, photo).then((photo: IPhoto|null) => {
            if(!photo) {
                return callback(24, 'photo_not_found', 404, 'Photo not found', null);
            }
            return callback(null, null, 200, null, photo);
        })
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const parsing_full_text = async function (query: string, 
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, result: string|null) => void) {
    try {
        const parsed_searchtext = await langchain.llm_parse_query(query)
        // json 파싱 및 각 항목에 대해 벡터화 
        return callback(null, null, 200, null, parsed_searchtext);
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const colorText_to_RGBcode = async function (color: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, result: string|null) => void) {
    try {
        const RGB_code = await langchain.llm_colorText_to_RGBcode(color)
        return callback(null, null, 200, null, RGB_code);
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const colorText_to_CIELAB = async function (color: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, result: string|null) => void) {
    try {
        const CIELAB_code = await langchain.llm_colorText_to_CIELAB(color)
        return callback(null, null, 200, null, CIELAB_code);
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const searchPhoto = function (sex: string, eyewear: string, helmet: string, upper: string, lower: string, socks: string, shoes: string, bicycle: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, vectorized_query: []) => void) {
    try {
        // pineconeDB.query() c 
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', []);
    }
}

export const uploadDescription = async function (photoId: string, appearDescription: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, response: any) => void) {
    try {
        // const response = await pineconeDB.upsert(photoId, vector, target_appear, meta_data);
        // return callback(null, null, 200, null, response);
        const vectorizedDescription = await langchain.vecterize_words(appearDescription);
        console.log('vectorizedDescription', vectorizedDescription)
        pineconeDB.upsert_by_photoId(photoId, vectorizedDescription, 'appearance_description', {});
        return callback(null, null, 200, null, appearDescription);
    } catch (error) {
        console.log('error', error);
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const uploadDescriptions = async function (appearDescriptions: any,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, response: any) => void) {
    try {
        console.log('length of appearDescriptions', appearDescriptions.length)
        const vectorizedDescriptions = [];
        for (let i = 0; i < appearDescriptions.length; i++) {
            let vectorizedDescription = await langchain.vecterize_words(appearDescriptions[i].appearDescription);
            vectorizedDescriptions.push({
                photoId: appearDescriptions[i].photoId,
                vectorizedDescription: vectorizedDescription
            })
        }
        pineconeDB.upsert_bulk(vectorizedDescriptions, 'appearance_description');
    } catch (error) {
        console.log('error', error);
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

export const vectorSearch = async function (query: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, response: any) => void) {
    try {
        // 검색어 파싱하여 룰 기반 검색어 생성 후 백터화 필요
        const parsed_query = await langchain.llm_parse_query(query);
        // {
        //     sex: null,
        //     helmet: 'white',
        //     eyewear: 'black',
        //     upper: 'red',
        //     lower: 'black',
        //     socks: 'white',
        //     shoes: 'black',
        //     gloves: null,
        //     bicycle: 'red'
        // }
        console.log('parsed_query', parsed_query)
        const restructured_query = await langchain.llm_generatre_query(parsed_query);
        console.log('restructured_query', restructured_query)
        const vectorizedQuery = await langchain.vecterize_words(restructured_query);
        const responses = await pineconeDB.query_single_namespace(vectorizedQuery, 'appearance_description');
        console.log('vectorizedQuery', vectorizedQuery)
        console.log('responses', responses)
        return callback(null, null, 200, null, responses);
    } catch (error) {
        console.log('error', error);
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

/**
 * 
 * @param field "helmet" | "eyewear" | "upper" | "lower" | "socks" | "shoes" | "gloves" | "bicycle"
 * @returns list of colors
 */
export const aggregateColorByField = async function (field: string, 
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, response: any) => void) {
    try {
        await oPhoto.distinct('appearance.'+field+'.color').then((colors: string[]| unknown[]) => {
            console.log('colors of ', field, ' :', colors);
            return callback(null, null, 200, null, colors);
        })
        .catch((error: Error) => {
            console.log('error', error);
            return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        console.log('error', error);
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

/**
 * 
 * @param query 
 * @param callback 
 * @returns 
 * 
 * 1. 자연어 형태의 검색어를 받는다. ( 예: 하얀색 헬멧, 검은색 고글이랑, 빨간색 저지와 검은색 빕숏 흰색 양말에 검은색 클릿슈즈를 신었고 자전거는 빨간색이야)
 * 2. 검색어를 파싱하여 각 항목에대해 표현된 json 객체를 생성한다. ( 예: {helmet: 'white', eyewear: 'black', upper: 'red', lower: 'black', socks: 'white', shoes: 'black', gloves: null, bicycle: 'red'})
 * 3. 각 유효 항목에 대하여 MongoDB에 저장된 유니크한 값들을 가져와서 사전을 만든다 
 * ( 예: 
 *      {
 *          helmet: ['white', 'black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'gray', 'brown'],
 *          eyewear: ['black', 'white'],
 *          upper: ['white', 'black', 'red', 'orange', 'purple', 'pink', 'gray', 'brown'],
 *          ....
 *      }
 * )
 * 4. 사전 내의 value 값들을 텍스트 임베딩한다.
 * 5. 
 */
export const vectorSearch_by_color = async function (query: string,
        callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, response: any) => void) {
    try {
        let dictionary: {[key: string]: string} = {};            // DB내의 필드별 유니크값들의 임시사전 검색어 파싱 후 유효한 키값들에 대하여 사전생성..
        // 검색어 파싱하여 룰 기반 검색어 생성 후 백터화 필요
        const parsed_query = await langchain.llm_parse_query(query);
        const keys = Object.keys(parsed_query)
        let required_keys = [];
        for (let i = 0; i < keys.length; i++) {
            if (parsed_query[keys[i]] === null) {
                continue
                // delete parsed_query[keys[i]];
            }
            required_keys.push(keys[i]);
        }

    } catch (error) {
        console.log('error', error);
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}