export interface LoginResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullname: string;
    role: string;
  };
}
