# InfoWebLancers

InfoWebLancers adalah aplikasi web untuk mempertemukan client dengan freelancer web developer. Client dapat mencari freelancer berdasarkan profil dan skill, sedangkan freelancer dapat membuat profil, mengatur visibilitas, mengunggah avatar, dan menampilkan portofolio. Aplikasi ini juga menyediakan dashboard admin untuk mencari dan memperbarui data user tertentu.

## Fitur Utama

- **Landing page freelancer**: menampilkan daftar freelancer publik, pencarian berdasarkan nama/judul/bio, dan filter skill.
- **Autentikasi berbasis role**: login dan register untuk role `client` dan `freelancer`, dengan dukungan role `admin` di backend.
- **Redirect setelah login**:
  - Client diarahkan ke halaman client.
  - Freelancer diarahkan ke dashboard profil freelancer.
  - Admin diarahkan ke dashboard admin.
- **Profil freelancer**: edit title, bio, skill, nomor telepon, visibilitas profil, avatar, dan portofolio.
- **Profil client**: edit informasi client/perusahaan.
- **Upload media Cloudinary**: avatar freelancer dan gambar portofolio disimpan melalui Cloudinary.
- **Dashboard admin**: cari user berdasarkan email dan update nama/password user.
- **Proteksi route**: middleware melindungi area client, freelancer, dan admin dari akses tanpa token.

## Tech Stack

- **Framework**: Next.js 16 App Router
- **UI**: React 19, Tailwind CSS 4
- **Database ORM**: Prisma 7
- **Database**: PostgreSQL
- **Auth**: JWT, cookie `token`, bcrypt
- **Upload media**: Cloudinary
- **Bahasa**: TypeScript

## Struktur Project

```text
.
├── prisma/
│   └── schema.prisma          # Skema database Prisma
├── public/                    # Asset statis
├── src/
│   ├── app/                   # Route, page, layout, dan API Next.js
│   │   ├── api/               # API route untuk auth, profil, admin, portfolio
│   │   ├── admin/             # Halaman dashboard admin
│   │   ├── clients/           # Halaman client dan profil client
│   │   ├── freelancers/       # Halaman freelancer dan profil freelancer
│   │   ├── login/             # Halaman login
│   │   └── register/          # Halaman register
│   ├── components/            # Komponen UI dan form
│   ├── lib/                   # Helper Prisma, auth, API, Cloudinary
│   └── types/                 # Type shared
├── middleware.ts              # Proteksi route dan redirect auth
├── package.json               # Script dan dependency project
└── prisma.config.ts           # Konfigurasi Prisma
```

## Prasyarat

Pastikan sudah terpasang:

- Node.js versi modern yang kompatibel dengan Next.js 16
- npm
- PostgreSQL database
- Akun Cloudinary untuk fitur upload avatar dan portofolio

## Environment Variables

Buat file `.env` di root project, lalu isi variabel berikut:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="ganti-dengan-secret-yang-kuat"
CLOUDINARY_CLOUD_NAME="cloud-name"
CLOUDINARY_API_KEY="api-key"
CLOUDINARY_API_SECRET="api-secret"
```

Keterangan:

- `DATABASE_URL`: koneksi PostgreSQL yang dipakai Prisma dan aplikasi.
- `JWT_SECRET`: secret untuk menandatangani dan memverifikasi JWT.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: kredensial Cloudinary untuk upload dan hapus media.

## Instalasi dan Menjalankan Project

1. Install dependency:

   ```bash
   npm install
   ```

2. Siapkan database dan generate Prisma Client:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Jalankan development server:

   ```bash
   npm run dev
   ```

4. Buka aplikasi di browser:

   ```text
   http://localhost:3000
   ```

## Script yang Tersedia

```bash
npm run dev      # Menjalankan development server
npm run build    # Build aplikasi untuk production
npm run start    # Menjalankan hasil build production
```

> Catatan: script `postinstall` akan menjalankan `prisma generate` otomatis setelah dependency di-install.

## Model Database

Project ini menggunakan beberapa model utama:

- **User**: data akun, email unik, password hash, dan role (`admin`, `freelancer`, `client`).
- **FreelancerProfile**: data profil freelancer, skill, nomor telepon, avatar, visibilitas, dan relasi portofolio.
- **ClientProfile**: data profil client/perusahaan.
- **Portfolio**: data project freelancer, deskripsi, link, dan gambar.

## Route Halaman

| Route | Deskripsi |
| --- | --- |
| `/` | Landing page dan daftar freelancer publik |
| `/about` | Halaman informasi/about |
| `/login` | Login user |
| `/register` | Register client/freelancer |
| `/clients` | Area client setelah login |
| `/clients/[id]` | Detail client |
| `/clients/profile/[id]` | Edit profil client |
| `/freelancers/[id]` | Dashboard/detail freelancer |
| `/freelancers/profile/[id]` | Edit profil freelancer |
| `/admin` | Dashboard admin |

## API Utama

| Endpoint | Method | Fungsi |
| --- | --- | --- |
| `/api/auth/register` | `POST` | Register user baru |
| `/api/auth/login` | `POST` | Login dan membuat JWT |
| `/api/auth/logout` | `GET` | Logout dan hapus cookie token |
| `/api/auth/change-password` | `POST` | Ganti password user login |
| `/api/admin/dashboard` | `GET`, `PATCH` | Cari dan update user oleh admin |
| `/api/clients/[id]` | `PATCH` | Update profil client |
| `/api/freelancers/[id]` | `PATCH` | Update profil freelancer |
| `/api/freelancers/[id]/avatar` | `POST`, `DELETE` | Upload/hapus avatar freelancer |
| `/api/freelancers/[id]/portfolios` | `POST` | Tambah portofolio freelancer |
| `/api/portfolios/[id]` | `DELETE` | Hapus portofolio |

## Alur Autentikasi Singkat

1. User login melalui `/login`.
2. API login memvalidasi email dan password dengan bcrypt.
3. Jika valid, aplikasi membuat JWT dan menyimpannya sebagai cookie `token`.
4. Middleware mengecek cookie tersebut untuk route protected.
5. User diarahkan sesuai role masing-masing.

## Catatan Pengembangan

- Gunakan `npm run build` sebelum deployment untuk memastikan tidak ada error TypeScript/Next.js.
- Pastikan `.env` tidak di-commit ke repository.
- Untuk perubahan schema Prisma, jalankan kembali `npx prisma generate` dan sinkronkan database dengan `npx prisma db push` atau migration flow yang sesuai.
- Jika upload media tidak berjalan, cek kembali kredensial Cloudinary dan konfigurasi folder upload.

## Deployment

Aplikasi dapat dideploy ke platform yang mendukung Next.js, seperti Vercel. Pastikan environment variables production sudah diset di dashboard deployment dan database PostgreSQL dapat diakses oleh aplikasi production.