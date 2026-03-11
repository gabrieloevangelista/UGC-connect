import { supabase } from "@/lib/supabase";

export const ADMIN_EMAILS = [
    "contato@ugcconnect.shop",
    "admin@ugcconnect.shop",
    "gabriel.evan.queiroz@gmail.com",
    "gabriel.evan.queiroz"
];

// Verificação síncrona básica (frontend) - Fallback
export function isUserAdmin(email?: string | null): boolean {
    if (!email) return false;
    if (ADMIN_EMAILS.includes(email)) return true;
    if (email.includes("gabriel.evan.queiroz")) return true;
    return false;
}

// Verificação assíncrona robusta (backend/db)
export async function checkAdminStatus(email: string | undefined): Promise<{ isAdmin: boolean; isMaster: boolean }> {
    if (!email) return { isAdmin: false, isMaster: false };

    // Primeiro verifica hardcoded para fallback imediato
    const isHardcodedAdmin = isUserAdmin(email);

    try {
        const { data, error } = await supabase
            .from("app_admins")
            .select("role")
            .eq("email", email)
            .single();

        if (error || !data) {
            // Se não está no banco, retorna o fallback hardcoded como admin master
            return { isAdmin: isHardcodedAdmin, isMaster: isHardcodedAdmin };
        }

        return {
            isAdmin: true,
            isMaster: data.role === 'master'
        };
    } catch {
        return { isAdmin: isHardcodedAdmin, isMaster: isHardcodedAdmin };
    }
}
