import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, fetchUserProfile } from "./userSlice";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
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
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            User Profile
          </h1>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Name:</span> {userName}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Email:</span> {user?.email}
          </p>
          {userProfile && (
            <>
              {userProfile.phone && (
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Phone:</span>{" "}
                  {userProfile.phone}
                </p>
              )}
              {userProfile.address && (
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Address:</span>{" "}
                  {userProfile.address}
                </p>
              )}
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Member since:</span>{" "}
                {new Date(userProfile.created_at).toLocaleDateString()}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="small"
            onClick={() => navigate("/profile/edit")}
            className="mt-4 md:mt-0"
          >
            Edit Profile
          </Button>
          <Button
            type="primary"
            onClick={handleLogout}
            className="mt-2 md:mt-0"
          >
            Logout
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Orders</h2>

        {isLoading ? (
          <p className="text-gray-600 text-center py-8">
            Loading your orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            You haven&apos;t placed any orders yet.
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
                    Order #{order.id.slice(0, 8)}...
                  </p>
                  <p className="text-gray-600">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Address:</span> {order.address}
                </p>
                {order.priority && (
                  <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Priority
                  </span>
                )}
                <div className="mt-2">
                  <Button
                    type="small"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
