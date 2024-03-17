import * as Mongoose from 'mongoose';
import reservedKeywords from '../utils/reservedKeywords';
import { upload } from '@google-cloud/storage/build/cjs/src/resumable-upload';
/**
 * Define interface for user appearance for inteligence analysis
 */
interface IAppearance {
    description: string,
    sex: string,
    helmet: {
        isWearing: boolean,
        color: string,
        description: string
    },
    eyewear: {
        isWearing: boolean
        color: string,
        description: string
    },
    upper: {
        sleeve: string,
        color: string,
        description: string
    },
    lower: {
        sleeve: string,
        color: string,
        description: string
    },
    sockes: {
        isWearing: boolean,
        color: string,
        description: string
    },
    shoes: {
        isWearing: boolean,
        color: string,
        description: string
    },
    gloves: {
        isWearing: boolean,
        color: string,
        description: string
    },
    bicycle: {
        isRiding: boolean,
        color: string,
        description: string
    },
}

/**
 * Define interface for user number plate for inteligence analysis
 */
interface INumberPlate {
    isNumberPlateDetected: boolean,
    numberPlate: string,
    probability: string
}

/**
 * Define interface for user model
 */
interface IPhoto extends Mongoose.Document {
    photoId: string;
    srcLink: string;
    competition: string;
    author: string;
    photographedTime: Date;
    width: number;
    height: number;
    fileSize: number;
    fileType: string;
    createdDate: Date;
    updatedDate: Date;
    // uploader: Mongoose.Schema.Types.ObjectId;
    isPhotoUploaded: boolean;
    isPhotoAnalyzedAppearance: boolean;
    isPhotoAnalyzedNumberPlate: boolean;
    appearance: IAppearance;
    numberPlate: INumberPlate[];
}

/**
 * Define user schema and set middleware function.
 */
const Schema = Mongoose.Schema;

const PhotoSchema = new Schema({
    /**
     * id field automatically generated by mongoDB
     */
    photoId: { // photoId is a unique identifier for each photo 
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    srcLink: {
        type: String,
        required: true,
    },
    competition: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    photographedTime: {
        type: Date,
        required: true,
    },
    width: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    // uploader: {
    //     type: Mongoose.Schema.Types.ObjectId,
    //     ref: 'users',
    //     required: true,
    // },
    isPhotoUploaded: {
        type: Boolean,
        default: false,
        required: true,
    },
    isPhotoAnalyzedAppearance: {
        type: Boolean,
        default: false,
        required: true,
    },
    isPhotoAnalyzedNumberPlate: {
        type: Boolean,
        default: false,
        required: true,
    },
    appearance: {
        description: {
            type: String,
            default: 'unknown', // default value is 'unknown
            required: true,
        },
        sex: {
            type: String,
            enum: ['male', 'fenmale', 'unknown'],
            default: 'unknown', // default value is 'unknown
            required: true,
        },
        helmet: {
            isWearing: {
                type: Boolean,
                default: false, // default value is 'unknown
                required: true,
            },
            color: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            },
            description: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            }
        },
        eyewear: {
            isWearing: {
                type: Boolean,
                deafult: false,
                required: true,
            },
            color: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            },
            description: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            }
        },
        upper: {
            sleeve: {
                type: String,
                required: true,
                default: 'unknown', // default value is 'unknown
                enum: ['short', 'long', 'unknown'],
            },
            color: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            },
            description: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            }
        },
        lower: {
            sleeve: {
                type: String,
                required: true,
                default: 'unknown', // default value is 'unknown
                enum: ['short', 'long', 'unknown'],
            },
            color: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            },
            description: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            }
        },
        socks: {
            isWearing: {
                type: Boolean,
                default: false, // default value is 'unknown
                required: true,
            },
            color: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            },
            description: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            }
        },
        shoes: {
            isWearing: {
                type: Boolean,
                default: false, // default value is 'unknown
                required: true,
            },
            color: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            },
            description: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            }
        },
        gloves: {
            isWearing: {
                type: Boolean,
                default: false, // default value is 'unknown
                required: true,
            },
            color: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            },
            description: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            }
        },
        bicycle: {
            isriding: {
                type: Boolean,
                default: false, // default value is 'unknown
                required: true,
            },
            color: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            },
            description: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            }
        }
    },
    numberPlate: [
        {
            isNumberPlateDetected: {
                type: Boolean,
                default: false, // default value is 'unknown
                required: true,
            },
            numberPlate: {
                type: String,
                default: 'unknown', // default value is 'unknown
                required: true,
            },
            probability: {
                type: Number,
                default: 0, // default value is 'unknown
                required: true,
            },
        }
    ]
});

/**
 * Modle Middle ware function setting
 */
PhotoSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedDate = currentDate;

    if (!this.createdDate) {
        this.createdDate = currentDate;
    }
    next();
})

const Photo = Mongoose.model<IPhoto>('photos', PhotoSchema);
export { Photo, IPhoto, IAppearance, INumberPlate};