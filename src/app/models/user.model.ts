import { Role } from "./role.model";

export class User{
    

    public name!: string;
    public email!:string;
    public password!:string;
    public gender!:string;
    public about!:string;
    public imageName!:string;
    public userId!:string;
    public roles:Role[] = [];

    constructor(private userName:string,private userEmail:string,private userPassword:string,
        private userGender:string,private userAbout:string,private rolesArr:Role[]){
        this.name = userName;
        this.email = userEmail;
        this.password = userPassword;
        this.gender = userGender;
        this.about = userAbout;
        this.roles = rolesArr;
    }
}