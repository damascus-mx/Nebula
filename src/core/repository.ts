export interface IRepository<T> {
    Create(model: T): Promise<void>;
    Update(Id: any, payload: any): Promise<void>;
    Delete(Id: any): Promise<void>;
    GetById(Id: any): Promise<T>;
    GetAll(): Promise<T[]>;
    FindOne(args?: any): Promise<T>;
    FindMany(args?:any): Promise<T[]>;
}