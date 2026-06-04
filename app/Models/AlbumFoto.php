<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AlbumFoto extends Model
{
    use HasUuidV7;

    protected $table = 'album_foto';

    protected $fillable = [
        'ekskul_id',
        'judul',
        'deskripsi',
        'dibuat_oleh',
    ];

    /**
     * Get the associated master extracurricular.
     */
    public function ekskul(): BelongsTo
    {
        return $this->belongsTo(Ekskul::class, 'ekskul_id');
    }

    /**
     * Get the user who created this album.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    /**
     * Get photos in this album.
     */
    public function foto(): HasMany
    {
        return $this->hasMany(Foto::class, 'album_foto_id');
    }
}
