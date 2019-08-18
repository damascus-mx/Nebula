export default interface IController {
    Create(req: any, res: any): any;
    Update(req: any, res: any): any;
    Delete(req: any, res: any): any;
    GetAll(req: any, res: any): any;
    GetById(req: any, res: any): any;
}