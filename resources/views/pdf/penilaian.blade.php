<!DOCTYPE html>
<html>
<head>
    <title>Laporan Penilaian - {{ $ekskulNama }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h2 {
            margin: 0;
            font-size: 16px;
            text-transform: uppercase;
        }
        .header h3 {
            margin: 5px 0 0 0;
            font-size: 12px;
            font-weight: normal;
        }
        .meta {
            margin-bottom: 15px;
        }
        .meta table {
            width: 100%;
        }
        .meta td {
            padding: 3px 0;
        }
        .table-data {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .table-data th {
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10px;
        }
        .table-data td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Pemerintah Provinsi Jawa Tengah</h2>
        <h3>Dinas Pendidikan dan Kebudayaan</h3>
        <h2 style="font-size: 18px; font-weight: 900; margin-top: 5px;">SMK Negeri 1 Bawang</h2>
        <p style="margin: 3px 0 0 0; font-size: 9px; italic;">Jl. Raya Bawang Km. 3, Banjarnegara, Jawa Tengah</p>
    </div>

    <div class="meta">
        <table>
            <tr>
                <td style="width: 20%; font-weight: bold;">Laporan</td>
                <td style="width: 3%;">:</td>
                <td>Nilai Akhir Anggota Ekstrakurikuler</td>
                <td style="width: 20%; font-weight: bold; text-align: right;">Tanggal Cetak</td>
                <td style="width: 3%; text-align: right;">:</td>
                <td style="text-align: right;">{{ $tanggalCetak }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold;">Ekstrakurikuler</td>
                <td>:</td>
                <td>{{ $ekskulNama }}</td>
                <td colspan="3">&nbsp;</td>
            </tr>
        </table>
    </div>

    <table class="table-data">
        <thead>
            <tr>
                <th style="width: 5%;" class="text-center">No</th>
                <th style="width: 30%;">Nama Lengkap</th>
                <th style="width: 15%;">NIS</th>
                <th style="width: 15%;">Kelas</th>
                <th style="width: 15%;" class="text-center">Nilai Akhir</th>
                <th style="width: 20%;">Penilai (Grader)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($anggota as $index => $a)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $a->user->nama }}</strong></td>
                    <td>{{ $a->user->nis ?? '-' }}</td>
                    <td>{{ $a->user->kelas ?? '-' }}</td>
                    <td class="text-center" style="font-weight: bold; font-size: 12px;">
                        {{ $a->penilaian ? floatval($a->penilaian->nilai_akhir) : 'Belum dinilai' }}
                    </td>
                    <td>{{ $a->penilaian && $a->penilaian->grader ? $a->penilaian->grader->nama : '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center" style="padding: 15px; color: #888;">Belum ada anggota aktif terdaftar.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Mengetahui,</p>
        <br><br><br>
        <p style="font-weight: bold; text-decoration: underline;">Pembina Ekstrakurikuler</p>
    </div>
</body>
</html>
