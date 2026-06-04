<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Inertia\Inertia;
use Inertia\Response;

class SocialiteController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->with(['hd' => 'smkn1bawang.sch.id'])
            ->redirect();
    }

    /**
     * Obtain the user information from Google.
     */
    public function callback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            $message = config('app.debug') 
                ? 'Gagal memuat autentikasi Google: ' . $e->getMessage() 
                : 'Gagal memuat autentikasi Google. Silakan coba lagi.';
            return redirect()->route('login')->with('error', $message);
        }

        $email = $googleUser->getEmail();
        
        // 1. Validate hosted domain if restricted
        if (config('services.google.restrict_domain', true)) {
            $domain = substr(strrchr($email, "@"), 1);
            if (!str_ends_with($domain, 'smkn1bawang.sch.id')) {
                return redirect()->route('login')->with('error', 'Akses ditolak. Harap gunakan email resmi sekolah dengan domain @smkn1bawang.sch.id');
            }
        }

        // 2. Find matching user in the database
        $user = User::where('email', $email)->first();

        if (!$user) {
            // Check if there are any users in the DB (fallback for first-time setup/seeding check)
            if (User::count() === 0) {
                // If DB is completely empty (no seeders run), auto-create an admin user
                $user = User::create([
                    'nama' => $googleUser->getName(),
                    'email' => $email,
                    'status' => 'aktif',
                    'email_verified_at' => now(),
                ]);
                $user->assignRole('kesiswaan');
            } else {
                return redirect()->route('login')->with('error', 'Akun Anda belum terdaftar di sistem. Silakan hubungi admin kesiswaan atau OSIS.');
            }
        }

        // 3. Ensure user status is active
        if ($user->status !== 'aktif') {
            return redirect()->route('login')->with('error', 'Akun Anda telah dinonaktifkan atau ditangguhkan.');
        }

        // 4. Update avatar if available from Google
        if ($googleUser->getAvatar() && empty($user->foto_profil)) {
            $user->update([
                'foto_profil' => $googleUser->getAvatar()
            ]);
        }

        // 5. Authenticate user
        Auth::login($user, true);

        // 6. Regenerate session to protect against session fixation
        $request->session()->regenerate();

        // 7. Redirect to dashboard
        return redirect()->intended('/dashboard');
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
