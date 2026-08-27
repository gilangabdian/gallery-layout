# Kenapa Tiptap Menggunakan `style.css` Milik Core?

Pertanyaanmu sangat tajam dan menunjukkan bahwa kamu memikirkan **Skalabilitas** dan **Developer Experience (DX)**. Kamu menyadari bahwa *Toolbar* dan *Modal* sebenarnya hanya digunakan oleh Tiptap saat ini, lalu mengapa CSS-nya ditaruh di `core`?

Berikut adalah alasan-alasan arsitektural (*Best Practice*) mengapa CSS ini **Sengaja Disatukan** di dalam paket `core`:

## 1. Single Source of Truth (Sistem Desain Terpusat)
Paket `core` dalam monorepo kita tidak hanya berfungsi sebagai logika Vanilla JS, melainkan bertindak sebagai **Design System** (Sistem Desain) utama.
- *Toolbar* dan *Modal* Tiptap menggunakan variabel CSS yang sama (seperti `--gallery-radius`, `--gallery-gap`, warna tombol, dsb) yang didefinisikan di `core`.
- Jika CSS *Toolbar* dipisah ke folder `tiptap/`, ia akan tetap sangat bergantung (*highly coupled*) pada variabel-variabel dari `core`. Pemisahan ini hanya akan menciptakan ketergantungan antar-file CSS yang rumit tanpa memberikan manfaat yang berarti.

## 2. Kemudahan Pengguna (Developer Experience / DX)
Bayangkan jika CSS-nya dipisah. Setiap kali pengguna ingin memakai ekstensi Tiptap-mu, mereka harus mengimpor **DUA** file CSS:

```typescript
// Jika dipisah, pengguna harus menulis ini:
import 'gallery-layout/style.css'
import 'tiptap-extension-gallery-layout/style.css'
```

Ini adalah mimpi buruk bagi *Developer Experience*. Pengguna rentan lupa mengimpor file kedua, yang menyebabkan *Toolbar* mereka hancur tanpa pesan *error* yang jelas.
Dengan menyatukannya di `core`, pengguna hanya perlu mengingat satu aturan suci: **"Cukup impor satu file `style.css` dari `gallery-layout`"**.

## 3. Komponen UI Ekstensi itu "Agnostik"
Walaupun saat ini *Toolbar* dan *Modal* hanya dipanggil dari ekstensi Tiptap, elemen-elemen HTML tersebut (tombol, *select*, *input*) murni dibangun menggunakan Vanilla JS DOM (bukan React, bukan Vue).
Artinya, elemen UI tersebut sebenarnya **Agnostik**. Jika di masa depan kamu membuat ekstensi untuk editor lain (misalnya ProseMirror murni, Slate, atau editor Vanilla buatanmu sendiri), kamu bisa menggunakan ulang desain CSS *Toolbar* tersebut karena ia sudah tersimpan aman di `core`.

## 4. Performa (Ukuran File vs Kerepotan)
Apakah menyatukan CSS membuat *Core* menjadi berat? **Tidak.**
File `style.css` gabungan kita saat ini ukurannya sangat mungil (hanya beberapa *kilobyte* setelah di- *minify*). Overhead mengunduh beberapa baris kode CSS untuk *Toolbar* (bagi pengguna *Core* murni) benar-benar **tidak terasa** (0 milidetik dampaknya). 
Sedangkan, biaya pemeliharaan (*maintenance cost*) untuk mengurus dua file CSS yang terpisah di monorepo jauh lebih berat bagi kamu sebagai *Maintainer*.

---

### Kesimpulan
Kamu sangat benar: **Jika dipisah, CSS *Toolbar* akan tetap mengemis/bergantung pada gaya bawaan *Core*, sehingga pemisahan itu percuma dan hanya menyusahkan *developer* yang memakai *library*-mu.**

Oleh karena itu, desain menyatukan seluruh visual (*Design System*) ke dalam **Satu File `style.css` di Core** adalah keputusan **Disengaja** yang didasarkan pada *Best Practice* pembuatan *Headless Library* kelas atas.
