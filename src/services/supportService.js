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
  try {
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

    const { data, error } = await supabase
      .from("messages") // Supabase'deki tablo adınız
      .insert([messageToSend])
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    throw error;
  }
}
