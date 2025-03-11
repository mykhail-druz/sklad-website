// types/user.ts

// Базовый интерфейс для метаданных пользователя
export interface UserMetadata {
    full_name?: string | null
    avatar_url?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
}

// Интерфейс для пользовательского профиля
export interface UserProfile {
    id: string
    email: string
    phone?: string | null
    full_name?: string | null
    avatar_url?: string | null
    created_at?: string
    updated_at?: string
}

// Интерфейс для данных пользователя при регистрации/входе
export interface AuthUser {
    id: string
    email: string
    user_metadata?: UserMetadata
}

// Тип для данных, передаваемых в saveUserProfile
export interface UserData {
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    full_name?: string | null
    avatar_url?: string | null
}
