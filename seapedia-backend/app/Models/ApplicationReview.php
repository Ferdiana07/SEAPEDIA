<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reviewer_name',
        'rating',
        'comment',
        'is_published',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_published' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
