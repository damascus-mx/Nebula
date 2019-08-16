export interface Repository<T> {
    Create(model: T): Promise<void>;
    Update(Id: any, payload: any): Promise<void>;
    Delete(Id: any): Promise<void>;
    GetById(Id: any): Promise<T>;
    GetAll(): Promise<T[]>;
}