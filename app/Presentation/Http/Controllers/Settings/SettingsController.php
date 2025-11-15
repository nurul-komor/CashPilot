<?php

namespace App\Presentation\Http\Controllers\Settings;

use App\Http\Requests\Settings\UpdateFinancialRequest;
use App\Http\Requests\Settings\UpdatePreferencesRequest;
use App\Http\Requests\Settings\UpdateProfileRequest;
use App\Presentation\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Ensure user has a profile, create if doesn't exist
        if (!$user->profile) {
            $user->profile()->create([
                'currency' => 'BDT',
                'date_format' => 'Y-m-d',
                'number_format' => 'en_US',
                'timezone' => 'Asia/Dhaka',
                'theme' => 'light',
                'language' => 'en',
                'email_notifications' => true,
                'push_notifications' => true,
                'country' => 'BD',
            ]);
            $user->refresh();
        }

        return Inertia::render('Settings/Index', [
            'user' => $user->load('profile'),
            'mustVerifyEmail' => $user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function updateProfile(UpdateProfileRequest $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->profile) {
            $user->profile()->create($request->validated());
        } else {
            $user->profile->update($request->validated());
        }

        return Redirect::route('settings.index')->with('status', 'profile-updated');
    }

    /**
     * Update the user's preferences.
     */
    public function updatePreferences(UpdatePreferencesRequest $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->profile) {
            $user->profile()->create($request->validated());
        } else {
            $user->profile->update($request->validated());
        }

        return Redirect::route('settings.index')->with('status', 'preferences-updated');
    }

    /**
     * Update the user's financial settings.
     */
    public function updateFinancial(UpdateFinancialRequest $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->profile) {
            $user->profile()->create($request->validated());
        } else {
            $user->profile->update($request->validated());
        }

        return Redirect::route('settings.index')->with('status', 'financial-updated');
    }
}

