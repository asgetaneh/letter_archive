<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'office' => $this->whenLoaded('office', fn () => [
                'id' => $this->office->id,
                'name' => $this->office->name,
            ]),
            'locale' => $this->locale,
            'is_active' => $this->is_active,
            'roles' => $this->whenLoaded('roles', fn () =>
                $this->roles->pluck('name')
            ),
            'permissions' => $this->whenLoaded('permissions', fn () =>
                $this->getAllPermissions()->pluck('name')
            ),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
