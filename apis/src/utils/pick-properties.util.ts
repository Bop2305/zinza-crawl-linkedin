import _ from 'lodash'

export const pickProperties = <T extends {},K extends keyof T>(obj: T, propertiesToPick: K[]): Pick<T, K> => {
    if (!obj || !propertiesToPick) {
        return obj as Pick<T, K>;
    }

    return _.pick(obj, propertiesToPick);
};