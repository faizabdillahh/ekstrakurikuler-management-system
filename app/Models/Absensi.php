<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absensi extends Model
{
    use HasUuidV7;

    protected $table = 'absensi';

    protected $fillable = [
        'sesi_absensi_id',
        'anggota_id',
        'status',
    ];

    /**
     * Get the associated session record.
     */
    public function sesiAbsensi(): BelongsTo
    {
        return $this->belongsTo(SesiAbsensi::class, 'sesi_absensi_id');
    }

    /**
     * Get the associated member record.
     */
    public function anggota(): BelongsTo
    {
        return $this->belongsTo(Anggota::class, 'anggota_id');
    }
}
