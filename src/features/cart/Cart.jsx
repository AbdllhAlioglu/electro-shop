import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, applyDiscount, clearDiscount } from "./cartSlice";
import LinkButton from "../../ui/LinkButton";
import Button from "../../ui/Button";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import RecommendedProducts from "./RecommendedProducts";
import { formatCurrency } from "../../utils/helpers";
import { toast } from "react-hot-toast";

function Cart() {
  const userName = useSelector((state) => state.user.userName);
  const cart = useSelector((state) => state.cart.cart);
  const discount = useSelector((state) => state.cart.discount);
  const dispatch = useDispatch();
  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  const totalCartPrice = useSelector((state) =>
    state.cart.cart.reduce((acc, item) => acc + item.totalPrice, 0)
  );
  const discountedPrice = totalCartPrice * (1 - discount / 100);

  const handleClearCart = () => {
    dispatch(clearCart());
    if (isCouponApplied) {
      dispatch(clearDiscount());
      setIsCouponApplied(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponError("Lütfen bir kupon kodu giriniz");
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError("");

    try {
      // Kupon kodunu veritabanından kontrol et
      // NOT: Gerçek bir veritabanı kontrolü yapılabilir
      // Bu örnekte basit bir kontrol yapıyoruz

      // Gerçek bir uygulama için veritabanında kupon kodunu kontrol edebilirsiniz:
      // const { data, error } = await supabase
      //   .from("coupons")
      //   .select("*")
      //   .eq("code", coupon)
      //   .single();

      // Şimdilik basit bir kontrol yapalım
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simüle edilmiş API çağrısı

      if (coupon === "Alioğlu") {
        dispatch(applyDiscount(20)); // %20 indirim uygula
        setIsCouponApplied(true);
        setCoupon("");
        setCouponError("");
        // Başarı bildirimi göster
        toast.success("Kupon uygulandı! %20 indirim kazandınız.");
      } else {
        // Kupon bulunamadı veya geçersiz
        setCouponError("Geçersiz kupon kodu");
        dispatch(clearDiscount()); // Önceki indirimi temizle
        setIsCouponApplied(false);
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCouponError("Kupon doğrulanırken hata oluştu");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(clearDiscount());
    setIsCouponApplied(false);
    setCoupon("");
    setCouponError("");
  };

  if (!cart.length) return <EmptyCart />;
  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu">&larr; Ürünlere Dön</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Sepetiniz, {userName}</h2>

      <ul className="mt-3 divide-y divide-stone-200 border-b">
        {cart.map((item) => (
          <CartItem item={item} key={item.id} discount={discount} />
        ))}
      </ul>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg font-semibold">
          {discount > 0 ? (
            <>
              <span className="text-gray-500 line-through mr-2">
                {formatCurrency(totalCartPrice)}
              </span>
              <span className="text-customGreen-600">
                {formatCurrency(discountedPrice)}
              </span>
            </>
          ) : (
            formatCurrency(totalCartPrice)
          )}
        </p>
        {discount > 0 && (
          <div className="px-3 py-1 bg-customGreen-50 text-customGreen-600 rounded-full text-sm font-medium">
            %{discount} indirim
          </div>
        )}
      </div>

      {/* Kupon bölümü */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium mb-2">İndirim Kuponu</p>
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder={
                isCouponApplied ? "Kupon uygulandı" : "Kupon kodu girin"
              }
              disabled={isCouponApplied || isValidatingCoupon}
              className="border p-2 rounded input w-full"
            />
            {couponError && (
              <p className="text-red-500 text-xs mt-1">{couponError}</p>
            )}
          </div>

          {isCouponApplied ? (
            <Button
              type="small"
              onClick={handleRemoveCoupon}
              className="bg-red-100 text-red-600 hover:bg-red-200"
            >
              Kaldır
            </Button>
          ) : (
            <Button
              type="small"
              onClick={handleApplyCoupon}
              disabled={isValidatingCoupon}
            >
              {isValidatingCoupon ? "Doğrulanıyor..." : "Uygula"}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 space-x-2">
        <Button to="/order/new" type="primary">
          Sipariş Ver
        </Button>
        <Button type="secondary" onClick={handleClearCart}>
          Sepeti Temizle
        </Button>
      </div>
      <RecommendedProducts />
    </div>
  );
}

export default Cart;
