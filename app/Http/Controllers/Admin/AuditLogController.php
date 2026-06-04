<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    /**
     * Display a listing of system audit logs.
     */
    public function index(): Response
    {
        $activities = Activity::with('causer')
            ->orderBy('created_at', 'desc')
            ->paginate(50)
            ->through(function ($act) {
                return [
                    'id' => $act->id,
                    'log_name' => $act->log_name,
                    'description' => $act->description,
                    'subject_type' => class_basename($act->subject_type),
                    'subject_id' => $act->subject_id,
                    'causer_name' => $act->causer ? $act->causer->nama : 'Sistem',
                    'causer_email' => $act->causer ? $act->causer->email : null,
                    'properties' => $act->properties,
                    'created_at' => $act->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Admin/AuditLog/Index', [
            'activities' => $activities,
        ]);
    }
}
