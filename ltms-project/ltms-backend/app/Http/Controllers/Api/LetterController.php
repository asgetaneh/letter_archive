<?php
// app/Http/Controllers/Api/LetterController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIncomingLetterRequest;
use App\Models\Letter;
use App\Services\ReferenceNumberService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class LetterController extends Controller
{
    public function __construct(
        private ReferenceNumberService $referenceService
    ) {}

    public function store(StoreIncomingLetterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $letter = DB::transaction(function () use ($validated, $request) {
            $letter = Letter::create([
                'reference_number' => $this->referenceService->generate('incoming'),
                'office_id' => $request->user()->office_id,
                'created_by' => $request->user()->id,
                'type' => 'incoming',
                'status' => 'registered',
                'priority' => $validated['priority'],
                'sender_name' => $validated['sender_name'],
                'letter_date' => $validated['letter_date'],
                'encrypted_body' => $validated['body'] ?? null,
                'received_date' => now(),
            ]);

            $letter->translations()->createMany([
                ['locale' => 'en', 'subject' => $validated['subject_en']],
                ['locale' => 'am', 'subject' => $validated['subject_am'] ?? $validated['subject_en']],
            ]);

            return $letter;
        });

        return response()->json($letter->load('translations'), 201);
    }

    public function incoming(): JsonResponse
    {
        $letters = Letter::where('type', 'incoming')
            ->where('office_id', request()->user()->office_id)
            ->with('translations')
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($letters);
    }
}
