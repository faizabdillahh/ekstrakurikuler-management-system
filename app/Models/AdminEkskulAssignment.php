<?php

namespace App\Models;

use App\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminEkskulAssignment extends Model
{
    use HasUuidV7;

    protected $table = 'admin_ekskul_assignments';

    protected $fillable = [
        'user_id',
        'ekskul_ta_id',
        'ditugaskan_oleh',
    ];

    /**
     * Get the assigned user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the yearly extracurricular scope.
     */
    public function ekskulTahunAjaran(): BelongsTo
    {
        return $this->belongsTo(EkskulTahunAjaran::class, 'ekskul_ta_id');
    }

    /**
     * Get the OSIS / Kesiswaan admin who created the assignment.
     */
    public function assigner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'ditugaskan_oleh');
    }
}
