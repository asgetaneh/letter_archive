<?php
// app/Http/Requests/StoreIncomingLetterRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIncomingLetterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole(['registrar', 'officer']);
    }

    public function rules(): array
    {
        return [
            'sender_name'   => ['required', 'string', 'max:255'],
            'subject_en'    => ['required', 'string', 'max:255'],
            'subject_am'    => ['nullable', 'string', 'max:255'],
            'letter_date'   => ['required', 'date', 'before_or_equal:today'],
            'priority'      => ['required', 'in:low,normal,high,urgent'],
            'body'          => ['nullable', 'string', 'max:50000'],
            'attachments.*' => ['nullable', 'file', 'mimes:pdf,jpg,png', 'max:10240'],
        ];
    }
}
