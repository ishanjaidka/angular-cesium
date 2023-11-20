export interface CurrentUser {
    userId: string;
    email: string;
    roles: string | string[];
    isEmailVerified: boolean;
    firstName: string;
    lastName: string;
    imageUrl: string;
    phoneNumber: string;
    twoFactorEnabled: string;
}