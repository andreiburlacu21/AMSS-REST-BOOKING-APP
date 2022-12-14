export default class TokenData {
    userName: string;
    accessToken: string;

  constructor(userName: string, accessToken: string) {
    this.userName = userName
    this.accessToken = accessToken
  }

}