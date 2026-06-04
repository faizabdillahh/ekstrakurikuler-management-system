<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Foto extends Model
{
    use HasUuidV7;

    protected $table = 'foto';

    const UPDATED_AT = null;

    protected $fillable = [
        'album_foto_id',
        'path',
        'caption',
        'urutan',
    ];

    protected $casts = [
        'urutan' => 'integer',
    ];

    /**
     * Get the associated album.
     */
    public function albumFoto(): BelongsTo
    {
        return $this->belongsTo(AlbumFoto::class, 'album_foto_id');
    }
}
