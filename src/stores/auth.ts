// src/stores/auth.ts
import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.user,
        userId: (state) => state.user?.id ?? null,
    },
    actions: {
        // fetch current user from Supabase and store it
        async fetchUser() {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser()
            if (error) throw error
            this.user = user
        },
        // helper to set user manually (e.g. onAuthStateChange)
        setUser(user: User | null) {
            this.user = user
        },
        // sign out
        async signOut() {
            await supabase.auth.signOut()
            this.user = null
        },
        // initialize store: fetch and subscribe to changes
        async initialize() {
            // 1) load existing user (if any)
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error) {
                    // if it’s “not logged in”, user will be null
                    console.warn('initialize.fetchUser:', error.message)
                }
                this.user = user
            } catch (err) {
                console.error('Unexpected initialize error:', err)
                this.user = null
            }

            // 2) subscribe to onAuthStateChange
            supabase.auth.onAuthStateChange((_event, session) => {
                this.user = session?.user ?? null
            })
        },
    },
})
