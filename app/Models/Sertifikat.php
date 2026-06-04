<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sertifikat extends Model
{
    use HasUuidV7;

    protected $table = 'sertifikat';

    protected $fillable = [
        'pendaftaran_id',
        'nama_file',
        'path',
        'mime_type',
        'ukuran_bytes',
    ];

    protected $casts = [
        'ukuran_bytes' => 'integer',
    ];

    /**
     * Get the associated registration record.
     */
    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class, 'pendaftaran_id');
    }
}
