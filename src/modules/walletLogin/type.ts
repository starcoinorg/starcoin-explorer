
export type UserInfo = {
    wallet_addr?: string
    e_mail?: string
    avatar?: string
    profile?: string
    [key: string]: any
}
export type APIKeysItem = {
    "api_key"?: string
    "app_name"?: string
    "create_time"?: string
    "id"?: number,
    "key_id"?: number,
    "user_id"?:number,
    "is_valid"?: boolean,
    [key: string]: any
}