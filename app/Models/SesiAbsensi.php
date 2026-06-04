<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SesiAbsensi extends Model
{
    use HasUuidV7;

    protected $table = 'sesi_absensi';

    protected $fillable = [
        'ekskul_ta_id',
        'tanggal',
        'keterangan',
        'dibuat_oleh',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    /**
     * Get the yearly extracurricular record.
     */
    public function ekskulTahunAjaran(): BelongsTo
    {
        return $this->belongsTo(EkskulTahunAjaran::class, 'ekskul_ta_id');
    }

    /**
     * Get the user/admin who created this session.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    /**
     * Get individual attendance records for this session.
     */
    public function absensi(): HasMany
    {
        return $this->hasMany(Absensi::class, 'sesi_absensi_id');
    }
}
