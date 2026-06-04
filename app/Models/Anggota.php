<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Anggota extends Model
{
    use HasUuidV7;

    protected $table = 'anggota';

    protected $fillable = [
        'user_id',
        'ekskul_ta_id',
        'status',
        'tanggal_bergabung',
        'tanggal_dikeluarkan',
        'dikeluarkan_oleh',
        'sumber',
    ];

    protected $casts = [
        'status' => 'string',
        'sumber' => 'string',
        'tanggal_bergabung' => 'date',
        'tanggal_dikeluarkan' => 'date',
    ];

    /**
     * Get the student user record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the yearly extracurricular record.
     */
    public function ekskulTahunAjaran(): BelongsTo
    {
        return $this->belongsTo(EkskulTahunAjaran::class, 'ekskul_ta_id');
    }

    /**
     * Get the admin who removed the member.
     */
    public function remover(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dikeluarkan_oleh');
    }

    /**
     * Get the organizational structure records (roles within the extracurricular).
     */
    public function strukturOrganisasi(): HasMany
    {
        return $this->hasMany(StrukturOrganisasi::class, 'anggota_id');
    }

    /**
     * Get the final grading for this member.
     */
    public function penilaian(): HasOne
    {
        return $this->hasOne(Penilaian::class, 'anggota_id');
    }

    /**
     * Get the attendance logs for this member.
     */
    public function absensi(): HasMany
    {
        return $this->hasMany(Absensi::class, 'anggota_id');
    }
}
