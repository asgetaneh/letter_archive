<?php
// app/Services/ReferenceNumberService.php
namespace App\Services;

use Illuminate\Support\Facades\DB;

class ReferenceNumberService
{
    public function generate(string $type = 'incoming'): string
    {
        $year = now()->format('Y');
        $prefix = $type === 'incoming' ? 'IN' : 'OUT';

        // Use a DB transaction to prevent duplicate numbers under concurrency
        return DB::transaction(function () use ($prefix, $year) {
            $last = DB::table('letters')
                ->where('reference_number', 'like', "{$prefix}-{$year}-%")
                ->lockForUpdate()
                ->orderByDesc('id')
                ->value('reference_number');

            $sequence = $last ? ((int) substr($last, -5)) + 1 : 1;

            return sprintf('%s-%s-%05d', $prefix, $year, $sequence);
        });
    }
}
