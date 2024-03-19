import { Competition as oCompetition, ICompetition } from '../models/Competition'

export const create = function (accessUserId: string, date: string, name: string, location: string, callback:(errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, competition: ICompetition|null) => void) {
    try {
        const competition = new oCompetition({
            date: date,
            name: name,
            location: location,
            createdDate: new Date(),
            updatedDate: new Date(),
        });
        competition.save().then((competition) => {
            return callback(null, null, 200, null, competition);
        })
        .catch((error) => {
            return callback(24, 'save_competition_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}

// export const deleteComp = function (comeptitionId: string, callback:(errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, competition: ICompetition|null) => void) {
//     try {
//         oCompetition.deleteOne('')
//     }
// }

export const getCompetitions = function (accessUserId: string, callback: (errorCode: number|null, shortMessage: string|null, httpCode: number, description: string|null, competitions: ICompetition[]|null) => void) {
    try {
        oCompetition.find({}, (error: Error, competitions: ICompetition[]) => {
            if (error) {
                return callback(24, 'get_competitions_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
            }
            return callback(null, null, 200, null, competitions);
        });
    } catch (error) {
        return callback(24, 'function_fail', 500, 'An error occurred for an unknown reason. Please contact the administrator.', null);
    }
}