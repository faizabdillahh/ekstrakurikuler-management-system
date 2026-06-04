<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Jadwal extends Model
{
    use HasUuidV7;

    protected $table = 'jadwal';

    protected $fillable = [
        'ekskul_ta_id',
        'hari',
        'jam_mulai',
        'jam_selesai',
        'lokasi',
        'keterangan',
    ];

    /**
     * Get the yearly extracurricular record.
     */
    public function ekskulTahunAjaran(): BelongsTo
    {
        return $this->belongsTo(EkskulTahunAjaran::class, 'ekskul_ta_id');
    }
}
