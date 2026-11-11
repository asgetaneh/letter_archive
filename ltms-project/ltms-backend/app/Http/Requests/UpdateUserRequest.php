<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('users.edit');
    }

    public function rules(): array
    {
        $userId = $this->route('user')->id;

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'office_id' => ['sometimes', 'exists:offices,id'],
            'locale' => ['nullable', Rule::in(['en', 'am'])],
            'is_active' => ['boolean'],
            'roles' => ['array'],
            'roles.*' => ['string', 'exists:roles,name'],
        ];
    }
}
