export interface Repository<T> {
    Create(model: T): void;
    Update(Id: any, payload: any): void;
    Delete(Id: any): void;
    GetById(Id: any): void;
    GetAll(): void;
}