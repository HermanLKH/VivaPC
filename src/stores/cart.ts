// src/stores/cart.ts
import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth'

// ─── 2) Public interfaces ─────────────────────────────────
interface Product {
    id: string
    name: string
    description: string
    price: number
    imageUrl: string
    category: string
}
interface CartItem {
    id: number
    productId: number
    quantity: number
    product: Product
}
interface Purchase {
    id: number
    date: string
    items: string[]
    total: number
    status: string
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [] as CartItem[],
        purchases: [] as Purchase[]
    }),

    actions: {
        /** Load the current user’s cart from Supabase */
        async fetchCart() {
            const auth = useAuthStore()
            const userId = auth.userId
            if (!userId) return

            const { data, error } = await supabase
                .from('cart_items')
                .select('id, product_id, quantity, products(*)')
                .eq('user_id', userId)

            if (error) {
                console.error('Error fetching cart:', error)
                return
            }
            if (!data) return

            this.items = data.map(item => {
                // products is always an array, take the first element
                const p = Array.isArray(item.products) ? item.products[0] : item.products
                return {
                    id: item.id,
                    productId: item.product_id,
                    quantity: item.quantity,
                    product: {
                        id: String(p.id),
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        imageUrl: p.image_url ?? '',
                        category: p.category ?? ''
                    }
                }
            })
        },

        /** Add one unit of `product` into cart_items (or increment existing) */
        async addItem(product: Product) {
            const auth = useAuthStore()
            const userId = auth.userId
            if (!auth.isLoggedIn) return

            // check existing
            const { data: existing } = await supabase
                .from('cart_items')
                .select('*')
                .eq('user_id', userId)
                .eq('product_id', Number(product.id))
                .single()

            if (existing) {
                // update + local state
                const { data: updated, error } = await supabase
                    .from('cart_items')
                    .update({ quantity: existing.quantity + 1 })
                    .eq('id', existing.id)
                    .select()
                    .single()

                if (error) {
                    console.error('Error incrementing cart:', error)
                    return
                }
                if (updated) {
                    const idx = this.items.findIndex(i => i.id === updated.id)
                    if (idx !== -1) this.items[idx].quantity = updated.quantity
                }
            } else {
                // insert + local state
                const { data: inserted, error } = await supabase
                    .from('cart_items')
                    .insert([{ user_id: userId, product_id: Number(product.id), quantity: 1 }])
                    .select()
                    .single()

                if (error) {
                    console.error('Error adding to cart:', error)
                    return
                }
                if (inserted) {
                    this.items.push({
                        id: inserted.id,
                        productId: inserted.product_id,
                        quantity: inserted.quantity,
                        product
                    })
                }
            }
        },

        /** Update quantity of an existing cart item */
        async updateItemQuantity(cartItemId: number, quantity: number) {
            await supabase
                .from('cart_items')
                .update({ quantity })
                .eq('id', cartItemId)

            const idx = this.items.findIndex(i => i.id === cartItemId)
            if (idx !== -1) this.items[idx].quantity = quantity
        },

        /** Remove a cart item entirely */
        async removeItem(cartItemId: number) {
            await supabase
                .from('cart_items')
                .delete()
                .eq('id', cartItemId)

            this.items = this.items.filter(i => i.id !== cartItemId)
        },

        /** Perform checkout: create purchase + items, then clean up cart */
        async checkout(selectedIds: number[]) {
            const auth = useAuthStore()
            const userId = auth.userId
            if (!auth.isLoggedIn || !userId) throw new Error('Login required')

            const itemsToPurchase = this.items.filter(i => selectedIds.includes(i.id))
            if (!itemsToPurchase.length) throw new Error('No items selected')

            const totalAmount = itemsToPurchase
                .reduce((sum, i) => sum + i.product.price * i.quantity, 0)

            // 1) insert purchase
            const { data: purchase, error: purchaseErr } = await supabase
                .from('purchases')
                .insert([{ user_id: userId, total_amount: totalAmount, status: 'pending' }])
                .select()
                .single()
            if (purchaseErr || !purchase) throw new Error(purchaseErr?.message || 'Purchase creation failed')

            // 2) insert purchase_items
            const purchaseItems = itemsToPurchase.map(i => ({
                purchase_id: purchase.id,
                product_id: i.productId,
                quantity: i.quantity,
            }))
            const { error: piErr } = await supabase
                .from('purchase_items')
                .insert(purchaseItems)
            if (piErr) console.error('Error inserting purchase items:', piErr.message)

            // 3) remove from cart_items
            const { error: delErr } = await supabase
                .from('cart_items')
                .delete()
                .in('id', selectedIds)
            if (delErr) console.error('Error deleting cart items:', delErr.message)

            // 4) update local state
            this.items = this.items.filter(i => !selectedIds.includes(i.id))
        },

        /** Load the current user’s past purchases */
        async fetchPurchases() {
            const auth = useAuthStore()
            const userId = auth.userId
            if (!userId) return

            const { data, error } = await supabase
                .from('purchases')
                .select(`
                    id,
                    created_at,
                    total_amount,
                    status,
                    purchase_items (
                        quantity,
                        products ( name )
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching purchases:', error)
                return
            }
            if (!data) return

            this.purchases = data.map(p => ({
                id: p.id,
                date: new Date(p.created_at).toLocaleDateString(),
                items: p.purchase_items.map(pi => {
                    const prod = Array.isArray(pi.products) ? pi.products[0] : pi.products
                    const name = prod?.name ?? 'Unknown product'
                    return `${name} x${pi.quantity}`
                }),
                total: p.total_amount,
                status: p.status
            }))
        }
    }
})
