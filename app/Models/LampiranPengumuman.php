<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LampiranPengumuman extends Model
{
    use HasUuidV7;

    protected $table = 'lampiran_pengumuman';

    // Disable default timestamps because migration only has created_at
    const UPDATED_AT = null;

    protected $fillable = [
        'pengumuman_id',
        'nama_file',
        'path',
        'mime_type',
        'ukuran_bytes',
    ];

    protected $casts = [
        'ukuran_bytes' => 'integer',
    ];

    /**
     * Get the associated announcement record.
     */
    public function pengumuman(): BelongsTo
    {
        return $this->belongsTo(Pengumuman::class, 'pengumuman_id');
    }
}
