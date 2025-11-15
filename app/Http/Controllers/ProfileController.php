<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile view page.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();

        // Ensure relationships are loaded and default to empty arrays
        $user->load([
            'profile',
            'education' => function ($query) {
                $query->orderBy('start_date', 'desc');
            },
            'skills' => function ($query) {
                $query->orderBy('category')->orderBy('name');
            },
            'workExperiences' => function ($query) {
                $query->orderBy('start_date', 'desc');
            },
            'projects' => function ($query) {
                $query->orderBy('start_date', 'desc');
            },
        ]);

        // Ensure arrays are set (Laravel should handle this, but just in case)
        if (!$user->relationLoaded('education')) {
            $user->setRelation('education', collect());
        }
        if (!$user->relationLoaded('skills')) {
            $user->setRelation('skills', collect());
        }
        if (!$user->relationLoaded('workExperiences')) {
            $user->setRelation('workExperiences', collect());
        }
        if (!$user->relationLoaded('projects')) {
            $user->setRelation('projects', collect());
        }

        return Inertia::render('Profile/Show', [
            'user' => $user,
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
        ]);
    }

    /**
     * Display the user's profile edit form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.show')->with('status', 'profile-updated');
    }

    /**
     * Display the account deletion confirmation page.
     */
    public function delete(Request $request): Response
    {
        return Inertia::render('Profile/Delete');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
