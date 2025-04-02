import { supabase } from "../libs/supabase";

// User registration with email and password
export async function registerUser(email, password, fullName) {
  try {
    // Register user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // Create user profile in the users table
    if (data.user) {
      await createUserProfile(data.user.id, {
        full_name: fullName,
        email: email,
        created_at: new Date().toISOString(),
      });
    }

    return data;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
}

// Create or update user profile in the users table
export async function createUserProfile(userId, userData) {
  try {
    const { error } = await supabase.from("users").upsert({
      id: userId,
      ...userData,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error creating user profile:", error.message);
    throw error;
  }
}

// Get user profile from the users table
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error getting user profile:", error.message);
    return null;
  }
}

// User login with email and password
export async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
}

// User logout
export async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Error logging out:", error.message);
    throw error;
  }
}

// Get current user session
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data?.session?.user || null;
  } catch (error) {
    console.error("Error getting current user:", error.message);
    return null;
  }
}

// Get user orders
export async function getUserOrders(userId) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    throw error;
  }
}
