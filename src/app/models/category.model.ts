export class Category{
    constructor(public title:string,public description:string,public coverImage:string,
        public categoryId:string
    ){}
}

export interface CategoryPaginatedResponse{
     content:Category[];
    lastPage:boolean;
    pageNumber:number;
    pageSize:number;
    totalElements:number;
    totalPages:number;
}