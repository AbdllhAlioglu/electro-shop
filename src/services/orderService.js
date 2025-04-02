import { supabase } from "../libs/supabase";
import { clearCart } from "../features/cart/cartSlice";
import store from "../store";

// Sipariş oluştur
export async function createOrder(newOrder) {
  try {
    console.log("Creating order in Supabase with ID:", newOrder.id);

    // Şimdiki zaman için timestamp oluştur
    const now = new Date().toISOString();

    // Get current user ID from state
    const state = store.getState();
    const userId = state.user.user?.id;

    // 1. Ana sipariş verisini orders tablosuna ekle
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        id: newOrder.id,
        customer: newOrder.customer,
        phone: newOrder.phone,
        address: newOrder.address,
        priority: newOrder.priority || false,
        created_at: now,
        updated_at: now,
        user_id: userId, // Add user_id to associate the order with the user
        discount_percentage: newOrder.discount || 0, // İndirim yüzdesi
        discounted_total: newOrder.discountedTotal || 0, // İndirimli toplam fiyat
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error("Order creation failed: " + orderError.message);
    }

    console.log("Order inserted:", orderData);

    // 2. Sipariş ürünlerini order_items tablosuna ekle
    if (newOrder.cart && newOrder.cart.length > 0) {
      const orderItems = newOrder.cart.map((item) => {
        // Ürün resmini doğru şekilde kontrol et
        const hasImage =
          item.image &&
          typeof item.image === "string" &&
          item.image.trim() !== "";

        return {
          order_id: newOrder.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.totalPrice,
          product_name: item.name,
          // Sadece geçerli bir resim varsa ekle, yoksa default bir görsel yolu kullan
          product_image: hasImage ? item.image : "/assets/default-product.png",
        };
      });

      console.log("Order items to be inserted:", orderItems);

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        // Sipariş ürünleri eklenmezse siparişi de sil
        await supabase.from("orders").delete().eq("id", newOrder.id);
        throw new Error("Order items creation failed: " + itemsError.message);
      }
    }

    console.log("Order successfully created:", newOrder.id);

    // Sepeti temizle
    store.dispatch(clearCart());

    // Oluşturulan siparişi döndür
    return {
      ...orderData,
      cart: newOrder.cart,
      discount: newOrder.discount || 0,
      discountedTotal: newOrder.discountedTotal || 0,
    };
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
}

// Sipariş getir
export async function getOrder(orderId) {
  try {
    console.log("Fetching order from Supabase...", orderId);

    // Ana sipariş bilgilerini al
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) {
      console.error("Error fetching order:", orderError);
      throw new Error(`Couldn't find order #${orderId}`);
    }

    console.log("Order fetched:", order);

    // Sipariş kalemlerini al
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      throw new Error(`Couldn't find items for order #${orderId}`);
    }

    console.log("Order items fetched:", orderItems);

    // Sipariş öğeleri bulunamadı veya boş dizi ise
    if (!orderItems || orderItems.length === 0) {
      console.warn(`No items found for order #${orderId}`);
      return {
        ...order,
        cart: [],
        discount: order.discount_percentage || 0,
        discountedTotal: order.discounted_total || 0,
      };
    }

    // Sipariş ve kalemlerini birleştir
    const cart = orderItems.map((item) => ({
      id: item.product_id,
      name: item.product_name,
      price: item.unit_price,
      image: item.product_image,
      quantity: item.quantity,
      totalPrice: item.total_price,
    }));

    // Indirim bilgisini ekle
    const result = {
      ...order,
      cart,
      discount: order.discount_percentage || 0,
      discountedTotal: order.discounted_total || 0,
    };

    console.log("Final order with items:", result);
    return result;
  } catch (error) {
    console.error("Error in getOrder:", error);
    throw new Error(`Error fetching order #${orderId}`);
  }
}

// Tüm siparişleri getir
export async function getAllOrders() {
  try {
    console.log("Fetching all orders from Supabase...");

    // Get current user ID from state
    const state = store.getState();
    const userId = state.user.user?.id;

    // Only get orders for the current user if authenticated
    const query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter by user_id if available
    if (userId) {
      query.eq("user_id", userId);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      throw new Error("Failed to fetch orders");
    }

    console.log("Orders fetched from Supabase:", orders);

    if (!orders || orders.length === 0) {
      console.log("No orders found in Supabase");
      return [];
    }

    // Her sipariş için sipariş kalemlerini al
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        console.log(`Fetching items for order ${order.id}...`);

        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);

        if (itemsError) {
          console.error(
            `Error fetching items for order ${order.id}:`,
            itemsError
          );
          return {
            ...order,
            cart: [],
            discount: order.discount_percentage || 0,
            discountedTotal: order.discounted_total || 0,
          };
        }

        console.log(`Items for order ${order.id}:`, orderItems);

        const cart = orderItems.map((item) => ({
          id: item.product_id,
          name: item.product_name,
          price: item.unit_price,
          image: item.product_image,
          quantity: item.quantity,
          totalPrice: item.total_price,
        }));

        return {
          ...order,
          cart,
          discount: order.discount_percentage || 0,
          discountedTotal: order.discounted_total || 0,
        };
      })
    );

    console.log("Final orders with items:", ordersWithItems);
    return ordersWithItems;
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    throw new Error("Failed to fetch orders");
  }
}
