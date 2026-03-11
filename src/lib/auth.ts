import { supabase } from "./supabase";

function getBaseUrl() {
    const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

    if (configured) return configured;

    if (typeof window !== "undefined") {
        return window.location.origin;
    }

    return "https://ugc-connect.vercel.app";
}

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${getBaseUrl()}/painel`,
        },
    });

    if (error) throw error;
    return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${getBaseUrl()}/painel`,
        },
    });

    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getUser() {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
}

export async function getSession() {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session;
}

export async function resetPasswordForEmail(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getBaseUrl()}/reset-senha`,
    });
    if (error) throw error;
    return data;
}

export async function updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
        password: password
    });
    if (error) throw error;
    return data;
}
