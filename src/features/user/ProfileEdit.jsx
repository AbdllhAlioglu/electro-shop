import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { fetchUserProfile } from "./userSlice";
import { createUserProfile } from "../../services/authService";

export default function ProfileEdit() {
  const { user, userProfile } = useSelector((state) => state.user);
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Fetch user profile if not available
    if (user && !userProfile) {
      dispatch(fetchUserProfile(user.id));
    }

    // Set default values when userProfile is loaded
    if (userProfile) {
      reset({
        full_name: userProfile.full_name || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
      });
    }
  }, [isAuthenticated, navigate, user, userProfile, dispatch, reset]);

  const onSubmit = async (data) => {
    if (!user) return;

    try {
      setIsSubmitting(true);

      await createUserProfile(user.id, {
        ...userProfile,
        ...data,
      });

      // Refresh user profile data
      dispatch(fetchUserProfile(user.id));
      setUpdateSuccess(true);

      // Auto-redirect after success
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Profile</h1>
        <p className="text-gray-600">Update your personal information</p>
      </div>

      {updateSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg">
          Profile updated successfully! Redirecting to profile page...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="full_name"
            type="text"
            className="input w-full"
            placeholder="Your full name"
            {...register("full_name", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Full name must be at least 2 characters",
              },
            })}
          />
          {errors.full_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="text"
            className="input w-full"
            placeholder="Your phone number"
            {...register("phone")}
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <textarea
            id="address"
            className="input w-full"
            placeholder="Your address"
            rows="3"
            {...register("address")}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="secondary" onClick={() => navigate("/profile")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
