
export class UserModel {
  public id: number;
  public name: string;
  public username: string;
  public email: string;
  public permissions: string[];

  public constructor(
    data?: UserModel
  ) {
    const user = data == null ? this : data;

    this.id = user.id;
    this.name = user.name || 'Guest';
    this.username = user.username;
    this.email = user.email;
    this.permissions = user.permissions || [];
  }
}
