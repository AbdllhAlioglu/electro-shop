// kullanıcılar için para formatı
export function formatCurrency(value) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(value);
}

//  kullanıcılar için tarih ve saat formatı
export function formatDateTime(dateStr) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

//  kullanıcılar için kalan süreyi hesapla
export function calculateRemainingTime(dateStr) {
  const now = new Date().getTime();
  const targetTime = new Date(dateStr).getTime();
  return Math.round((targetTime - now) / 60000);
}
