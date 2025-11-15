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
        $data['password'] = Hash::make($data['password']);
        $data['role'] = $data['role'] ?? 'student';

        $user = $this->userRepository->create($data);

        return [
            'user' => $user,
        ];
    }
}

