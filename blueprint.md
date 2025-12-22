
# Blueprint: Aplikasi Music Player Next.js

Dokumen ini berfungsi sebagai sumber kebenaran tunggal untuk arsitektur, fitur, dan riwayat pengembangan aplikasi pemutar musik ini.

## 1. Ikhtisar Proyek

Aplikasi ini adalah pemutar musik berbasis web yang dibangun dengan Next.js dan Supabase. Pengguna dapat mengautentikasi, mengunggah file musik mereka sendiri, dan memutarnya melalui antarmuka yang bersih dan modern.

## 2. Fitur Inti

-   **Autentikasi Pengguna**: Login dan manajemen sesi menggunakan Supabase Auth.
-   **Unggah Musik**: Pengguna dapat mengunggah file audio (misalnya, `.mp3`) dan gambar sampul opsional.
-   **Penyimpanan File**: File audio dan gambar disimpan di Supabase Storage.
-   **Manajemen Lagu**: Metadata lagu (judul, artis, durasi, path file) disimpan dalam tabel `songs` di database Supabase.
-   **Pemutar Musik**: Antarmuka pemutar musik persisten dengan kontrol untuk play/pause, next/previous, shuffle, repeat, volume, dan progress bar.
-   **Manajemen Daftar Lagu**: Pengguna dapat melihat daftar lagu yang telah mereka unggah dan menghapusnya.

## 3. Desain & Teknologi

-   **Framework**: Next.js (dengan App Router)
-   **Backend & Database**: Supabase (PostgreSQL, Storage, Auth)
-   **Styling**: Tailwind CSS dengan `shadcn/ui` untuk komponen UI yang dapat diakses dan dapat disusun.
-   **Manajemen State**: Zustand (untuk state management sisi klien yang ringan, khususnya untuk state pemutar musik).

---

## 4. Post-Mortem Debugging: Kegagalan Pemutaran Musik

Dokumen ini mencatat proses investigasi untuk menyelesaikan error kritis di mana lagu gagal diputar.

### Masalah (Problem)

Lagu yang telah berhasil diunggah tidak dapat diputar. Ketika pengguna mengklik tombol putar, pemutar musik muncul tetapi lagu tidak berjalan. Konsol browser menampilkan `Runtime NotSupportedError` dengan pesan `Failed to load because no supported source was found`.

### Penyebab Utama (Root Cause)

Penyebab utamanya adalah **ketidakcocokan fundamental antara metode akses file yang diharapkan oleh Supabase Storage dan yang diimplementasikan oleh aplikasi**.

Secara default, file di Supabase Storage bersifat **pribadi (private)** dan memerlukan **URL Bertanda Tangan (Signed URL)** yang memiliki token sementara untuk diakses. Aplikasi, sebaliknya, mencoba membuat dan mengakses **URL Publik (Public URL)** yang tidak memiliki otorisasi, sehingga akses ditolak oleh Supabase.

### Jejak Investigasi & Pendekatan (Investigation Trail & Approaches)

Error ini sulit dipecahkan karena tertutupi oleh beberapa masalah konfigurasi dan bug minor lainnya. Berikut adalah langkah-langkah yang kami ambil:

1.  **Pemeriksaan Kebijakan (Policy)**: Awalnya, kami menduga masalahnya ada pada Row Level Security (RLS) di Supabase. Kami memastikan kebijakan `SELECT` dan `INSERT` ada untuk tabel `songs`, dan kebijakan untuk `storage.objects` juga ada. Ini adalah langkah yang benar tetapi bukan akar masalahnya.

2.  **Ketidakcocokan `snake_case` vs `camelCase`**: Kami menemukan bahwa data yang diambil dari Supabase menggunakan `snake_case` (misalnya, `audio_url`), tetapi komponen React mengharapkan `camelCase` (misalnya, `audioUrl`). Ini adalah bug nyata yang menyebabkan `audioUrl` menjadi `undefined`. Kami memperbaikinya dengan mengubah data secara manual, tetapi ini hanya mengungkap masalah berikutnya.

3.  **Ketidakcocokan Nama Bucket**: Kami menemukan bahwa kode secara *hardcoded* menggunakan nama bucket `'music'`, sementara bucket yang sebenarnya di Supabase bernama `'audio'`. Kami menyelaraskannya, tetapi error tetap ada.

4.  **Duplikasi Path (`/audio/audio/`)**: Investigasi lebih lanjut menunjukkan bahwa logika unggahan membuat folder tambahan yang tidak perlu di dalam bucket, menghasilkan path yang salah (misalnya, `/audio/audio/file.mp3`). Ini kami perbaiki, tetapi masih belum menyelesaikan masalah inti.

5.  **Momen "Aha!": URL Publik vs. Bertanda Tangan**: Terobosan terjadi ketika kami membandingkan URL yang dihasilkan oleh tombol "Get URL" di dasbor Supabase dengan URL yang coba diakses oleh aplikasi. URL Supabase berisi `/sign/` dan parameter `?token=`, yang mengonfirmasi bahwa itu adalah **Signed URL**. Ini adalah petunjuk final yang mengungkapkan bahwa seluruh pendekatan URL publik kami salah.

### Solusi (Solution)

Solusi definitif adalah dengan sepenuhnya mengadopsi alur kerja Signed URL:

1.  **Menyimpan Path, Bukan URL**: Logika unggahan di `components/UploadMusic.tsx` diubah secara drastis. Alih-alih membuat URL publik dan menyimpannya, kami sekarang hanya menyimpan **path file** (misalnya, `user_id/timestamp-filename.mp3`) ke kolom `audio_url` di database.

2.  **Membuat URL Secara Dinamis**: Logika pemuatan lagu di `app/(main)/songs/page.tsx` diubah. Setiap kali halaman dimuat, ia mengambil daftar *path* dari database, lalu untuk setiap path, ia memanggil fungsi `supabase.storage.from('audio').createSignedUrl()` untuk membuat URL bertanda tangan yang baru, aman, dan berfungsi dengan masa berlaku sementara (1 jam).

3.  **Pembersihan Data**: Pengguna diinstruksikan untuk menghapus semua lagu lama (yang menyimpan URL yang salah) dan mengunggahnya kembali untuk memastikan database hanya berisi path file yang benar.

Pendekatan ini tidak hanya memperbaiki bug tetapi juga secara signifikan meningkatkan keamanan aplikasi dengan tidak mengekspos URL file secara publik dan permanen.
