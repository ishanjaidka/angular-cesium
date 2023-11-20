export interface UserInfo {
    id: string;
    email_confirmed: boolean;
    email: string;
    given_name: string;
    family_name: string;
    phone_number: string;
    two_factor_enabled: string;
    pending_phone_number: string;
    picture: string;
    role: string | string[];
}