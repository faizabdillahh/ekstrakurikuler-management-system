<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ekskul extends Model
{
    use HasUuidV7;

    protected $table = 'ekskul';

    protected $fillable = [
        'nama',
        'kategori',
        'deskripsi',
        'logo_url',
        'warna_primer',
        'warna_sekunder',
        'media_sosial',
        'is_active',
    ];

    protected $casts = [
        'media_sosial' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the active yearly records of this extracurricular.
     */
    public function ekskulTahunAjaran(): HasMany
    {
        return $this->hasMany(EkskulTahunAjaran::class, 'ekskul_id');
    }

    /**
     * Get the photo albums associated with this extracurricular.
     */
    public function albumFoto(): HasMany
    {
        return $this->hasMany(AlbumFoto::class, 'ekskul_id');
    }
}
