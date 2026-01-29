'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UserSettings {
    id: string
    user_id: string
    currency: string
    date_format: string
    fiscal_year_start: string
    subscription_plan: 'free' | 'premium'
    created_at: string
    updated_at: string
}

export async function getUserSettings(): Promise<{ success: boolean; settings?: UserSettings; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in' }
        }

        // Try to get existing settings
        const { data: settings, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            console.error('Get settings error:', error)
            return { success: false, error: 'Failed to get settings' }
        }

        // If no settings exist, create default settings
        if (!settings) {
            const { data: newSettings, error: insertError } = await supabase
                .from('user_settings')
                .insert({
                    user_id: user.id,
                    currency: 'INR',
                    date_format: 'DD/MM/YYYY',
                    fiscal_year_start: 'April',
                    subscription_plan: 'free'
                })
                .select()
                .single()

            if (insertError) {
                console.error('Create settings error:', insertError)
                // Return default settings without error
                return {
                    success: true,
                    settings: {
                        id: '',
                        user_id: user.id,
                        currency: 'INR',
                        date_format: 'DD/MM/YYYY',
                        fiscal_year_start: 'April',
                        subscription_plan: 'free',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                }
            }

            return { success: true, settings: newSettings as UserSettings }
        }

        return { success: true, settings: settings as UserSettings }
    } catch (error) {
        console.error('Settings error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

export async function updateUserSettings(
    currency: string,
    dateFormat?: string,
    fiscalYearStart?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in' }
        }

        // Check if settings exist
        const { data: existing } = await supabase
            .from('user_settings')
            .select('id')
            .eq('user_id', user.id)
            .single()

        const updateData: Record<string, string> = {
            currency,
            updated_at: new Date().toISOString()
        }

        if (dateFormat) updateData.date_format = dateFormat
        if (fiscalYearStart) updateData.fiscal_year_start = fiscalYearStart

        if (existing) {
            // Update existing settings
            const { error } = await supabase
                .from('user_settings')
                .update(updateData)
                .eq('user_id', user.id)

            if (error) {
                console.error('Update settings error:', error)
                return { success: false, error: 'Failed to update settings' }
            }
        } else {
            // Insert new settings
            const { error } = await supabase
                .from('user_settings')
                .insert({
                    user_id: user.id,
                    ...updateData
                })

            if (error) {
                console.error('Insert settings error:', error)
                return { success: false, error: 'Failed to save settings' }
            }
        }

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/settings')
        revalidatePath('/dashboard/transactions')
        revalidatePath('/dashboard/reports')

        return { success: true }
    } catch (error) {
        console.error('Update settings error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

// Upgrade user to premium plan
export async function upgradeToPremium(): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: 'Please sign in' }
        }

        const { error } = await supabase
            .from('user_settings')
            .update({
                subscription_plan: 'premium',
                updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)

        if (error) {
            console.error('Upgrade error:', error)
            return { success: false, error: 'Failed to upgrade. Please try again.' }
        }

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (error) {
        console.error('Upgrade error:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

// Check if user has premium subscription
export async function isPremiumUser(): Promise<boolean> {
    try {
        const { settings } = await getUserSettings()
        return settings?.subscription_plan === 'premium'
    } catch {
        return false
    }
}
