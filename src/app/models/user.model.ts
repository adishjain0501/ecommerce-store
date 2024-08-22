export class User{
    

    public name!: string;
    public email!:string;
    public password!:string;
    public gender!:string;
    public about!:string;
    public imageName!:string;
    public userId!:string;
    public roles!:Array<{roleId:string,roleName:string}>;

    constructor(private userName:string,private userEmail:string,private userPassword:string,
        private userGender:string,private userAbout:string){
        this.name = userName;
        this.email = userEmail;
        this.password = userPassword;
        this.gender = userGender;
        this.about = userAbout;
    }
}