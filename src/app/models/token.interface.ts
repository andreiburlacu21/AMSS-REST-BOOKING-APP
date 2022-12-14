export interface Token {
    Identifier: number;
    nbf: number;
    exp: number;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}