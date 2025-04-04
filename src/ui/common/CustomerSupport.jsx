import React, { useState, useEffect } from "react";
import { FaHeadset, FaTimes, FaPaperPlane } from "react-icons/fa";
import { sendSupportMessage } from "../../services/supportService";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useSelector } from "react-redux";

function CustomerSupport() {
  const { isAuthenticated, user } = useAuth();
  const userName = useSelector((state) => state.user.userName);

  // Kullanıcının mevcut bilgilerini almak için
  const userProfile = useSelector((state) => state.user.userProfile);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
  });
  const [isButtonAnimated, setIsButtonAnimated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kullanıcı giriş yapmışsa bilgilerini formda doldur
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prevData) => ({
        ...prevData,
        name:
          userName ||
          userProfile?.full_name ||
          user.user_metadata?.full_name ||
          "",
        email: user.email || userProfile?.email || "",
      }));
    }
  }, [isAuthenticated, user, userName, userProfile]);

  // Düzenli aralıklarla logo animasyonunu tetikle
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsButtonAnimated(true);
      setTimeout(() => setIsButtonAnimated(false), 1500);
    }, 5000);

    return () => clearInterval(animationInterval);
  }, []);

  const toggleSupport = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Supabase'e mesajı gönder
      await sendSupportMessage({
        sender: formData.name,
        email: formData.email,
        content: formData.message,
        phone: formData.phone || null,
      });

      // Başarılı bildirim göster
      toast.success("Mesajınız alındı! En kısa sürede size dönüş yapacağız.");

      // Formu temizle ve kapat - isim ve email dışındakileri temizle
      const updatedForm = {
        name: isAuthenticated ? formData.name : "",
        email: isAuthenticated ? formData.email : "",
        message: "",
        phone: "",
      };
      setFormData(updatedForm);
      setIsOpen(false);
    } catch (error) {
      // Hata durumunda bildirim göster
      toast.error(
        "Mesajınız gönderilirken bir hata oluştu. Siteye giriş yaptığınızda emin olunuz."
      );
      console.error("Mesaj gönderme hatası:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Destek butonu */}
      <button
        className={`bg-customGreen-500 hover:bg-customGreen-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300 ${
          isButtonAnimated ? "animate-pulse-ring" : ""
        }`}
        onClick={toggleSupport}
        aria-label="Müşteri Desteği"
      >
        {isOpen ? (
          <FaTimes className="h-6 w-6" />
        ) : (
          <FaHeadset className="h-6 w-6" />
        )}
      </button>

      {/* Destek formu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl overflow-hidden w-80 md:w-96 transition-all duration-300 animate-fade-up">
          <div className="bg-customGreen-500 text-white p-4">
            <h3 className="text-lg font-semibold">Bize Ulaşın</h3>
            <p className="text-sm opacity-90">
              Sorularınızı yanıtlamaktan memnuniyet duyarız
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Adınız
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customGreen-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                E-posta Adresiniz
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customGreen-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Telefon (İsteğe bağlı)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customGreen-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mesajınız
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customGreen-500"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-customGreen-500 hover:bg-customGreen-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-2" />
                  Gönder
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CustomerSupport;
