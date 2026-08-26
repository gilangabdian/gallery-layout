# Kenapa Fitur Edit Title Langsung Hilang?

Halo Mas Abdian! Menjawab rasa penasaranmu tentang kenapa fitur "edit title dengan klik langsung" ini sempat hilang, ini penjelasannya secara teknis:

## Akar Masalah: Transisi ke createGallery Core
Pada awalnya, mungkin integrasi Tiptap membuat dan me-render elemen gambarnya sendiri secara manual, sehingga ada kode khusus yang menyisipkan contenteditable="true" dan event listener pada igcaption.

Namun, dalam penyempurnaan arsitektur terbaru kita, Tiptap NodeView dibuat agar **sepenuhnya bergantung pada Core Library** (packages/core/src/gallery.ts). NodeView Tiptap kini memanggil fungsi createGallery() untuk me-render galeri. 

Fungsi createGallery() di Core Library adalah fungsi *vanilla JS* murni yang didesain untuk **tampilan akhir (Read-Only)** di website pengunjung. Oleh karena itu, ia menghasilkan <figcaption> biasa yang statis. Ketika Tiptap menggunakan ulang fungsi ini, DOM yang dihasilkan tentu saja tidak memiliki fitur contenteditable bawaan editor. Ini adalah efek samping dari arsitektur *framework-agnostic* yang sangat ketat memisahkan antara Core dan Tiptap. 

## Solusi yang Akan Diterapkan
Untuk mengembalikan fitur ini **tanpa** merusak Core Library, aku akan menyuntikkan logika khusus ke dalam Tiptap NodeView (packages/tiptap/src/index.ts) tepat setelah fungsi createGallery selesai dipanggil:

1. **Injeksi contentEditable**: Saat berada di mode *Edit Blog*, aku akan mencari semua elemen <figcaption> hasil *render* Core Library dan menambahkan atribut contenteditable="true".
2. **Auto-Focus saat Gambar Diklik**: Aku akan menambahkan *event listener* pada <img />. Jika gambar diklik (dan *captions* sedang diaktifkan), maka kursor akan langsung melompat (fokus) ke dalam teks <figcaption> yang terkait.
3. **Penyimpanan (Save on Blur)**: Saat user selesai mengetik title dan mengklik area lain (*blur*), aku akan menangkap teks terbarunya dan memperbarui atribut images di dalam state Tiptap.

Dengan cara ini, Core Library tetap bersih sebagai penampil statis, sementara integrasi Tiptap kembali memiliki fitur interaktif yang *seamless*!
