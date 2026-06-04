<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TahunAjaran extends Model
{
    use HasUuidV7;

    protected $table = 'tahun_ajaran';

    protected $fillable = [
        'nama',
        'tanggal_mulai',
        'tanggal_selesai',
        'is_aktif',
        'is_archived',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'is_aktif' => 'boolean',
        'is_archived' => 'boolean',
    ];

    /**
     * Get the activated extracurriculars for this school year.
     */
    public function ekskulTahunAjaran(): HasMany
    {
        return $this->hasMany(EkskulTahunAjaran::class, 'tahun_ajaran_id');
    }

    /**
     * Get the registration period for this school year.
     */
    public function periodePendaftaran(): HasMany
    {
        return $this->hasMany(PeriodePendaftaran::class, 'tahun_ajaran_id');
    }
}
