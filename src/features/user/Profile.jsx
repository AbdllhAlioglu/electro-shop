import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, fetchUserProfile } from "./userSlice";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/common/Button";
import { useAuth } from "../../context/AuthContext";
import { getUserOrders } from "../../services/authService";

export default function Profile() {
  const { user, userName, userProfile } = useSelector((state) => state.user);
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Fetch user profile if not available
    if (user && !userProfile) {
      dispatch(fetchUserProfile(user.id));
    }

    async function fetchUserOrders() {
      try {
        setIsLoading(true);
        const userOrders = await getUserOrders(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserOrders();
  }, [isAuthenticated, navigate, user, userProfile, dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Kullanıcı Profili
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            {userProfile?.avatar ? (
              <img
                src={userProfile.avatar}
                alt="Profil fotoğrafı"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {userName || "Misafir Kullanıcı"}
            </h2>
            <p className="text-gray-600">{user?.email || "E-posta yok"}</p>
            {userProfile?.phone && (
              <p className="text-gray-600">{userProfile.phone}</p>
            )}
            <div className="mt-4 flex gap-2">
              <Button type="small" onClick={() => navigate("/profile/edit")}>
                Profili Düzenle
              </Button>
              <Button type="primary" onClick={handleLogout}>
                Çıkış Yap
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Teslimat Adresleri
          </h2>

          {userProfile?.addresses && userProfile.addresses.length > 0 ? (
            <div className="space-y-4">
              {userProfile.addresses.map((address, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium text-gray-800">{address.name}</p>
                  <p className="text-gray-600">{address.street}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-gray-600">{address.country}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Henüz kayıtlı adresiniz bulunmamaktadır.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Siparişlerim
          </h2>

          {isLoading ? (
            <p className="text-gray-600 text-center py-8">
              Siparişleriniz yükleniyor...
            </p>
          ) : orders.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              Henüz hiç sipariş vermediniz.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <p className="font-medium text-gray-800">
                      Sipariş #{order.id.slice(0, 8)}...
                    </p>
                    <p className="text-gray-600">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Adres:</span> {order.address}
                  </p>
                  {order.priority && (
                    <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Öncelikli
                    </span>
                  )}
                  <div className="mt-2">
                    <Button
                      type="small"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      Detayları Görüntüle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
