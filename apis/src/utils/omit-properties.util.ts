import _ from 'lodash'

export const omitProperties = <T extends {}, K extends keyof T>(obj: T, propertiesToOmit: K[]): Omit<T, K>  => {
    if (!obj || !propertiesToOmit) {
        return obj as Omit<T, K>;
    }
    
    return _.omit(obj, propertiesToOmit);
};