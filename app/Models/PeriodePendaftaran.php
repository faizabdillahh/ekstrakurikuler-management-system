<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PeriodePendaftaran extends Model
{
    use HasUuidV7;

    protected $table = 'periode_pendaftaran';

    protected $fillable = [
        'tahun_ajaran_id',
        'tanggal_buka',
        'tanggal_tutup',
    ];

    protected $casts = [
        'tanggal_buka' => 'datetime',
        'tanggal_tutup' => 'datetime',
    ];

    /**
     * Get the school year record.
     */
    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class, 'tahun_ajaran_id');
    }
}
