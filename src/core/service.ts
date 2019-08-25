export default interface IService<T> {
    create(payload: any): Promise<T>;
    update(Id: any, payload: any): Promise<void>;
    delete(Id: any): Promise<number>;
    getAll(limit: number, page: number): Promise<T[]>;
    getById(Id: any): Promise<T>;
}