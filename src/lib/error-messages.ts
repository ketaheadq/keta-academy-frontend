/**
 * Error messages for user-facing notifications
 */
const errorMessages = {
	invalid_credentials: "Geçersiz kullanıcı adı veya şifre.",
	unauthorized: "Bu işlem için yetkiniz bulunmamaktadır.",
	network_error: "Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.",
	server_error: "Sunucu hatası. Lütfen daha sonra tekrar deneyin.",
	validation_error: "Girdiğiniz bilgilerde hata var. Lütfen kontrol edin.",
	session_expired: "Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.",
	access_denied: "Erişim reddedildi.",
	not_found: "Aradığınız sayfa bulunamadı.",
	timeout: "İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.",
	file_too_large: "Dosya boyutu çok büyük.",
	invalid_file_type: "Geçersiz dosya türü.",
	quota_exceeded: "Kotanız aşıldı.",
	maintenance: "Sistem bakımda. Lütfen daha sonra tekrar deneyin.",
} as const;

export default errorMessages;
