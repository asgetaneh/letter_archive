<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('users.create');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'office_id' => ['required', 'exists:offices,id'],
            'locale' => ['nullable', Rule::in(['en', 'am'])],
            'is_active' => ['boolean'],
            'roles' => ['array'],
            'roles.*' => ['string', 'exists:roles,name'],
        ];
    }
}
