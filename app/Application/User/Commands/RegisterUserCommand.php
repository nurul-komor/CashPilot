<?php

namespace App\Application\User\Commands;

use App\Domain\User\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class RegisterUserCommand
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    public function __invoke(array $data): array
    {
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'] ?? 'student',
        ]);

        return ['user' => $user];
    }
}

