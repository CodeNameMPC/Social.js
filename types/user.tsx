export interface IUser {
  _id?: string;
    loginType: string;
    name: string;
    image: string;
    biography: string;
    website: string;
    email: string;
    password?: string;
    confirmedPassword?: string;
}