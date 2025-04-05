import { supabase } from "../libs/supabase";

/**
 * Müşteri destek mesajını Supabase veritabanına kaydeder
 * @param {Object} messageData - Mesaj verileri
 * @param {string} messageData.sender - Gönderen adı
 * @param {string} messageData.email - E-posta adresi
 * @param {string} messageData.content - Mesaj içeriği
 * @param {string} messageData.phone - Telefon numarası (isteğe bağlı)
 * @param {string} messageData.subject - Konu (isteğe bağlı)
 * @returns {Promise<Object>} Kaydedilen mesaj verisi
 */
export async function sendSupportMessage(messageData) {
  // İsteğe bağlı alanları kontrol et ve değerleri ayarla
  const messageToSend = {
    sender: messageData.sender || messageData.name, // sender veya name alanını kabul et
    email: messageData.email,
    content: messageData.content || messageData.message, // content veya message alanını kabul et
    phone: messageData.phone || null,
    subject: messageData.subject || "Müşteri Mesajı", // Varsayılan konu
    date: new Date().toISOString(),
    isread: false, // Başlangıçta okunmamış olarak işaretle
  };

  // Herkes tarafından erişilebilir şekilde işlem yapma
  const { data, error } = await supabase
    .from("messages")
    .insert([messageToSend])
    .select();

  if (error) {
    // Hata varsa direkt fırlat
    throw error;
  }

  return data[0];
}
